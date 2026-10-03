import { bookingWeeks, parseDate, dateLabel } from './booking-weeks.js';

// A month view supplements the native date field, which remains available
// for direct entry and platform date-picker accessibility.
export function createBookingCalendar(container, onSelect) {
  let displayedMonth = null;
  let state = null;
  function draw() {
    const { start, count, minimum, calendar, submitting } = state;
    const first = parseDate(minimum);
    if (!displayedMonth) displayedMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1, 12));
    const month = displayedMonth.getUTCMonth();
    const year = displayedMonth.getUTCFullYear();
    const heading = document.createElement('div');
    heading.className = 'booking-calendar-heading';
    const title = document.createElement('strong');
    title.id = 'booking-calendar-month';
    title.setAttribute('aria-live', 'polite');
    title.textContent = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(displayedMonth);
    for (const direction of [-1, 1]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '←' : '→';
      button.setAttribute('aria-label', direction < 0 ? 'Previous month' : 'Next month');
      button.dataset.monthDirection = String(direction);
      const target = new Date(Date.UTC(year, month + direction, 1, 12));
      const monthKey = date => date.toISOString().slice(0, 7);
      button.disabled = submitting || monthKey(target) < minimum.slice(0, 7) || Boolean(calendar?.lastWeek && monthKey(target) > calendar.lastWeek.slice(0, 7));
      button.addEventListener('click', () => {
        displayedMonth = target;
        draw();
        const replacement = container.querySelector(`[data-month-direction="${direction}"]`);
        if (!replacement.disabled) replacement.focus();
        else container.querySelector('[data-week-date]')?.focus();
      });
      heading.append(button);
      if (direction < 0) heading.append(title);
    }
    const grid = document.createElement('div');
    grid.className = 'booking-calendar-days';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-labelledby', title.id);
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(day => {
      const label = document.createElement('span'); label.className = 'booking-day-label'; label.textContent = day; label.setAttribute('aria-hidden', 'true'); grid.append(label);
    });
    const offset = (displayedMonth.getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) grid.append(document.createElement('span'));
    let weeks = [];
    try { weeks = bookingWeeks(start, count, calendar || { firstWeek: minimum }); } catch { /* No valid selection yet. */ }
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let day = 1; day <= days; day++) {
      const date = new Date(Date.UTC(year, month, day, 12));
      const iso = date.toISOString().slice(0, 10);
      const monday = date.getUTCDay() === 1;
      const cell = document.createElement(monday ? 'button' : 'span');
      cell.className = 'booking-day';
      cell.textContent = String(day);
      const covered = weeks.some(week => {
        const difference = (date.getTime() - parseDate(week).getTime()) / 86400000;
        return difference >= 0 && difference < 5;
      });
      cell.classList.toggle('is-covered', covered);
      if (monday) {
        cell.type = 'button';
        cell.dataset.weekDate = iso;
        cell.setAttribute('aria-label', `Start week of ${dateLabel(iso)}`);
        cell.setAttribute('aria-pressed', String(start === iso));
        cell.classList.toggle('is-start', start === iso);
        let valid = iso >= minimum;
        try { bookingWeeks(iso, count, calendar || { firstWeek: minimum }); } catch { valid = false; }
        cell.disabled = submitting || !valid;
        cell.addEventListener('click', () => {
          onSelect(iso);
          container.querySelector(`[data-week-date="${iso}"]`)?.focus();
        });
      } else cell.setAttribute('aria-hidden', 'true');
      grid.append(cell);
    }
    const note = document.createElement('p');
    note.className = 'booking-calendar-key';
    note.textContent = 'Choose a Monday · Shading shows your selected weeks';
    container.replaceChildren(heading, grid, note);
  }
  return next => {
    if (state?.start !== next.start && next.start) {
      try { const date = parseDate(next.start); displayedMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12)); } catch { /* Keep current month while editing. */ }
    }
    if (state?.minimum !== next.minimum && !next.start) displayedMonth = null;
    state = next;
    draw();
  };
}
