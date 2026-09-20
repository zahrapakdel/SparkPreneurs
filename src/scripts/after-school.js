import { bookingWeeks, nextMonday, dateLabel } from './booking-weeks.js';
import { createBookingCalendar } from './booking-calendar.js';

const shop = document.querySelector('[data-after-school-shop]');
if (shop) {
  const find = selector => shop.querySelector(selector);
  const form = find('[data-registration-form]');
  const start = find('[data-start-date]');
  const count = find('[data-week-count]');
  const checkout = find('[data-checkout]');
  const clear = find('[data-clear]');
  let selected = null;
  let calendar = null;
  let ready = false;
  let submitting = false;
  let step = 1;
  function showStep(value) {
    step = value;
    find('[data-schedule-panel]').hidden = step !== 1;
    find('.registration-weeks').hidden = step !== 1;
    find('.registration-family').hidden = step !== 2;
    find('.registration-family').disabled = step !== 2;
    find('[data-next]').hidden = step !== 1;
    find('[data-back]').hidden = step !== 2;
    checkout.hidden = step !== 2;
    clear.hidden = step !== 1;
    find('[data-step-caption]').textContent = `STEP ${step} OF 2`;
    find('#registration-title').textContent = step === 1 ? 'When would you like to start?' : 'Who’s joining the fun?';
    shop.querySelectorAll('[data-progress]').forEach(item => { if (Number(item.dataset.progress) === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
    render();
    find('#registration-title').focus({ preventScroll: true });
    find('.registration-card').scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  start.min = nextMonday();
  const renderCalendar = createBookingCalendar(find('[data-booking-calendar]'), value => { start.value = value; render(); });
  const money = cents => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
  const status = (message, type = '') => { find('[data-status]').textContent = message; find('[data-status]').dataset.type = type; };
  const post = async payload => {
    const response = await fetch(shop.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.error || 'Registration could not be processed.');
    return data;
  };
  function selection() {
    return bookingWeeks(start.value, Number(count.value), calendar || { firstWeek: start.min });
  }
  function render() {
    start.setCustomValidity('');
    count.setCustomValidity('');
    let weeks = [];
    try { weeks = selection(); }
    catch (error) {
      if (start.value) start.setCustomValidity(error.message);
      find('[data-week-summary]').textContent = start.value ? error.message : 'Select a starting week to see your dates.';
    }
    if (weeks.length) {
      const heading = document.createElement('p');
      heading.textContent = `Your ${weeks.length} weeks of creative afternoons`;
      const range = document.createElement('p');
      range.className = 'booking-date-range';
      const end = new Date(weeks.at(-1) + 'T12:00:00Z');
      end.setUTCDate(end.getUTCDate() + 4);
      range.textContent = `${dateLabel(weeks[0])} – ${dateLabel(end.toISOString().slice(0, 10))}`;
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'See every included week';
      const list = document.createElement('ul');
      weeks.forEach(week => { const item = document.createElement('li'); item.textContent = `Week of ${dateLabel(week)}`; list.append(item); });
      details.append(summary, list);
      find('[data-week-summary]').replaceChildren(heading, range, details);
    }
    shop.querySelectorAll('[data-plan]').forEach(card => {
      const active = selected?.code === card.dataset.code;
      card.classList.toggle('is-selected', active);
      const button = card.querySelector('[data-select-plan]');
      button.disabled = submitting;
      button.textContent = active ? 'Selected' : 'Select plan';
      button.setAttribute('aria-pressed', String(active));
    });
    const validCount = Number.isInteger(Number(count.value)) && Number(count.value) >= 4 && Number(count.value) <= 52;
    const subtotal = selected && validCount ? selected.price * Number(count.value) : 0;
    find('[data-selected-plan]').textContent = selected ? `${selected.name} · ${validCount ? count.value : 'Choose your'} weeks` : 'No weekly plan selected yet.';
    find('[data-totals]').hidden = !selected || !validCount;
    find('[data-subtotal-label]').textContent = `Subtotal (${count.value} weeks)`;
    find('[data-subtotal]').textContent = money(subtotal);
    find('[data-tax]').textContent = money(Math.round(subtotal * .13));
    find('[data-total]').textContent = money(subtotal + Math.round(subtotal * .13));
    checkout.disabled = submitting || !ready || !selected || !weeks.length;
    find('[data-next]').disabled = submitting || !selected || !weeks.length;
    find('[data-back]').disabled = submitting;
    if (step === 2 && weeks.length) {
      const finalDay = new Date(weeks.at(-1) + 'T12:00:00Z');
      finalDay.setUTCDate(finalDay.getUTCDate() + 4);
      find('[data-selected-plan]').textContent += ` · ${dateLabel(weeks[0])} – ${dateLabel(finalDay.toISOString().slice(0, 10))}`;
    }
    clear.disabled = submitting || !selected;
    form.querySelectorAll('input').forEach(input => { input.disabled = submitting; });
    shop.querySelectorAll('[data-week-preset]').forEach(button => { button.disabled = submitting; button.setAttribute('aria-pressed', String(Number(button.dataset.weekPreset) === Number(count.value))); });
    shop.querySelectorAll('[data-week-adjust]').forEach(button => { button.disabled = submitting || (Number(button.dataset.weekAdjust) < 0 ? Number(count.value) <= 4 : Number(count.value) >= 52); });
    renderCalendar({ start: start.value, count: Number(count.value), minimum: start.min, calendar, submitting });
  }
  shop.addEventListener('click', event => {
    const button = event.target.closest('[data-select-plan]');
    if (!button || submitting) return;
    const card = button.closest('[data-plan]');
    selected = selected?.code === card.dataset.code ? null : { code: card.dataset.code, name: card.dataset.name, price: Number(card.dataset.price) };
    render();
  });
  start.addEventListener('input', render);
  count.addEventListener('input', render);
  shop.addEventListener('click', event => {
    const preset = event.target.closest('[data-week-preset]');
    const adjust = event.target.closest('[data-week-adjust]');
    if (submitting || (!preset && !adjust)) return;
    count.value = String(preset ? Number(preset.dataset.weekPreset) : Math.max(4, Math.min(52, (Number(count.value) || 4) + Number(adjust.dataset.weekAdjust))));
    render();
  });
  find('[data-next]').addEventListener('click', () => {
    render();
    if (!selected || !start.reportValidity() || !count.reportValidity()) return;
    showStep(2);
  });
  find('[data-back]').addEventListener('click', () => { if (!submitting) showStep(1); });
  clear.addEventListener('click', () => { selected = null; start.value = ''; count.value = '4'; render(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (step === 1) { find('[data-next]').click(); return; }
    if (submitting || !ready || !selected) return;
    render();
    if (!start.checkValidity() || !count.checkValidity()) { showStep(1); start.reportValidity(); return; }
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    const subtotal = selected.price * Number(count.value);
    submitting = true;
    render();
    checkout.textContent = 'Opening secure payment…';
    status('Checking your registration dates and total…', 'pending');
    try {
      const pageUrl = location.origin + location.pathname;
      const data = await post({ ...fields, weekCount: Number(fields.weekCount), action: 'createCheckoutSession', programCode: shop.dataset.programCode, selectedItemCodes: [selected.code], displayedAmountCents: subtotal + Math.round(subtotal * .13), successUrl: pageUrl + '?payment=success', cancelUrl: pageUrl + '?payment=canceled#register' });
      const url = new URL(data.checkoutUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new Error('Secure payment did not return a valid link.');
      location.href = url.href;
    } catch (error) {
      submitting = false;
      checkout.textContent = 'Continue to secure payment';
      status(error.message || 'Payment could not be started. Please try again.', 'error');
      render();
    }
  });
  async function initialize() {
    try {
      const health = await post({ action: 'ping' });
      if (!health.success || health.programCode !== shop.dataset.programCode || health.bookingVersion !== 1 || health.stripeMode !== 'live') throw new Error('Weekly checkout is being updated. Please contact SparkPreneurs to register.');
      calendar = await post({ action: 'getBookingCalendar', programCode: shop.dataset.programCode });
      start.min = calendar.firstWeek > nextMonday() ? calendar.firstWeek : nextMonday();
      start.max = calendar.lastWeek;
      ready = true;
      const closures = calendar.closedWeeks || [];
      if (closures.length) find('#week-help').textContent += ` Closed weeks: ${closures.map(dateLabel).join(', ')}. Choose a block that does not include these weeks.`;
    } catch (error) { status(error.message || 'Secure checkout is temporarily unavailable.', 'warning'); }
    render();
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'canceled') status('Payment was canceled. You can choose your weeks again.', 'warning');
    if (params.get('payment') === 'success' && params.get('session_id')) {
      try {
        const data = await post({ action: 'verifyCheckoutSession', sessionId: params.get('session_id') });
        status(data.paid ? 'Payment received. Your selected weeks have been recorded.' : 'Payment is still processing. Please contact us if this does not update.', data.paid ? 'success' : 'warning');
      } catch { status('We could not confirm your payment. Please contact us with your receipt.', 'warning'); }
    }
    if (params.has('payment')) history.replaceState({}, document.title, location.pathname + '#register');
  }
  render();
  initialize();
}
