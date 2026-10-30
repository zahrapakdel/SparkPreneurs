const shop = document.querySelector('[data-camp-shop]');
if (shop) {
  const find = selector => shop.querySelector(selector);
  const buttons = [...shop.querySelectorAll('[data-camp-session]')];
  const form = find('[data-camp-form]');
  const checkout = find('[data-camp-checkout]');
  const clear = find('[data-camp-clear]');
  const selected = new Map();
  const programCode = shop.dataset.programCode;
  let ready = false;
  let submitting = false;
  const money = cents => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
  const status = (message, type = '') => {
    find('[data-camp-status]').textContent = message;
    find('[data-camp-status]').dataset.status = type;
  };
  const amounts = () => {
    const subtotal = [...selected.values()].reduce((sum, item) => sum + Number(item.dataset.price), 0);
    const tax = Math.round(subtotal * .13);
    return { subtotal, tax, total: subtotal + tax };
  };
  const post = async payload => {
    const response = await fetch(shop.dataset.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
    });
    let data;
    try { data = JSON.parse(await response.text()); }
    catch { throw new Error('The registration service returned an unreadable response. Please try again.'); }
    if (!response.ok || !data || data.success === false) throw new Error(data?.error || 'Registration could not be processed.');
    return data;
  };
  function render() {
    buttons.forEach(button => {
      const active = selected.get(button.dataset.week) === button;
      button.setAttribute('aria-pressed', String(active));
      button.disabled = submitting;
      button.querySelector('[data-camp-session-label]').textContent = active ? 'Added' : 'Add to cart';
    });
    const list = find('[data-camp-cart]');
    list.replaceChildren();
    if (!selected.size) {
      const item = document.createElement('li');
      item.textContent = 'No sessions selected yet.';
      list.append(item);
    }
    selected.forEach((button, week) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = `${button.dataset.name} — ${money(Number(button.dataset.price))}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${button.dataset.name}`);
      remove.disabled = submitting;
      remove.addEventListener('click', () => { if (!submitting) { selected.delete(week); render(); } });
      item.append(name, remove);
      list.append(item);
    });
    const total = amounts();
    find('[data-camp-totals]').hidden = !selected.size;
    find('[data-camp-subtotal]').textContent = money(total.subtotal);
    find('[data-camp-tax]').textContent = money(total.tax);
    find('[data-camp-total]').textContent = money(total.total);
    checkout.disabled = submitting || !ready || !selected.size;
    clear.disabled = submitting || !selected.size;
    form.querySelectorAll('input').forEach(input => { input.disabled = submitting; });
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    if (submitting) return;
    const week = button.dataset.week;
    if (selected.get(week) === button) selected.delete(week);
    else selected.set(week, button);
    render();
  }));
  clear.addEventListener('click', () => { if (!submitting) { selected.clear(); render(); } });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !ready || !selected.size || !form.reportValidity()) return;
    // The existing camp backend sells AM and PM products; full day buys both.
    const details = [...selected.values()].flatMap(button => {
      const sessions = button.dataset.session === 'FULL' ? ['AM', 'PM'] : [button.dataset.session];
      return sessions.map(session => ({ code: `W${button.dataset.week}${session}`, name: button.dataset.name,
        displayedPriceCents: Number(button.dataset.price) / sessions.length }));
    });
    const fields = Object.fromEntries(new FormData(form));
    const total = amounts().total;
    submitting = true;
    checkout.textContent = 'Opening Secure Payment…';
    status('Checking your sessions and total…', 'pending');
    render();
    try {
      const result = await post({ ...fields, action: 'createCheckoutSession', programCode,
        selectedWeeks: details.map(item => item.code), selectedWeekDetails: details,
        displayedAmountCents: total,
        successUrl: shop.dataset.returnUrl + '?payment=success&session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: shop.dataset.returnUrl + '?payment=canceled#camp-registration' });
      const url = new URL(result.checkoutUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new Error('The payment service returned an invalid checkout link.');
      location.assign(url.href);
    } catch (error) {
      submitting = false;
      checkout.textContent = 'Continue to Secure Payment';
      status(error.message || 'Payment could not be started. Please try again.', 'error');
      render();
    }
  });
  async function initialize() {
    try {
      const health = await post({ action: 'ping' });
      // The original shared service predates stripeMode in health responses.
      ready = health.success === true && (health.stripeMode == null || health.stripeMode === 'live')
        && (health.programCode === programCode || health.programs?.includes(programCode));
      if (!ready) throw new Error('Secure checkout is being updated. Please contact SparkPreneurs.');
      status('');
    } catch (error) { status(error.message || 'Secure checkout is temporarily unavailable.', 'error'); }
    render();
    const params = new URLSearchParams(location.search);
    const cleanReturn = () => history.replaceState({}, document.title, location.pathname + '#camp-registration');
    if (params.get('payment') === 'canceled' || params.get('payment') === 'cancelled') {
      status('Payment was canceled. Choose your sessions when you are ready.', 'warning');
      cleanReturn();
    }
    if (params.get('payment') === 'success' && params.get('session_id')) {
      status('Checking payment status…', 'pending');
      try {
        const result = await post({ action: 'verifyCheckoutSession', stripeSessionId: params.get('session_id') });
        if (result.paymentStatus !== 'paid') throw new Error('Payment is not confirmed yet. Refresh this page to check again, or contact SparkPreneurs with your receipt.');
        selected.clear();
        render();
        status(result.message || 'Payment verified. Your camp registration has been received.', 'success');
        cleanReturn();
      } catch (error) { status(error.message || 'Payment could not be verified. Refresh to retry, or contact SparkPreneurs.', 'error'); }
      find('#camp-registration').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  render();
  initialize();
}
