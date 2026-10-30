// Synced from sparkpreneurs.github.io/summer-camp/shop.js (2026 schedule).
// Availability follows the source's explicit closed/open flags.
export const summerCampSessions = [
  { label: 'Morning', time: '10 AM–12 PM', multiplier: 1 },
  { label: 'Afternoon', time: '1–3 PM', multiplier: 1 },
  { label: 'Full day', time: '10 AM–3 PM', multiplier: 2 },
] as const;

const schedule = [
  { week: '01', dates: 'July 6–10, 2026', startDate: '2026-07-06', endDate: '2026-07-10', theme: 'Young Chef Creations', sessionPriceCents: 10500, sourceClosed: true },
  { week: '02', dates: 'July 13–17, 2026', startDate: '2026-07-13', endDate: '2026-07-17', theme: '3D Storybook Makers', sessionPriceCents: 10500, sourceClosed: true },
  { week: '03', dates: 'July 20–24, 2026', startDate: '2026-07-20', endDate: '2026-07-24', theme: 'Around the World', sessionPriceCents: 10500, sourceClosed: true },
  { week: '04', dates: 'July 27–31, 2026', startDate: '2026-07-27', endDate: '2026-07-31', theme: 'Dream House Designers', sessionPriceCents: 10500, sourceClosed: true },
  { week: '05', dates: 'August 4–7, 2026', startDate: '2026-08-04', endDate: '2026-08-07', theme: 'Fashion Week', sessionPriceCents: 8400, sourceClosed: true },
  { week: '06', dates: 'August 10–14, 2026', startDate: '2026-08-10', endDate: '2026-08-14', theme: 'Young Chef Creations 2', sessionPriceCents: 10500, sourceClosed: true },
  { week: '07', dates: 'August 17–21, 2026', startDate: '2026-08-17', endDate: '2026-08-21', theme: '3D Storybook Makers', sessionPriceCents: 10500, sourceClosed: false },
  { week: '08', dates: 'August 24–28, 2026', startDate: '2026-08-24', endDate: '2026-08-28', theme: 'Dream House Designers', sessionPriceCents: 10500, sourceClosed: false },
];

export function getSummerCampWeeks() {
  return schedule.map((week) => ({
    ...week,
    image: `/images/summer-camp-week-${Number(week.week)}.png`,
    ended: week.sourceClosed,
    fourDay: week.week === '05',
  }));
}
