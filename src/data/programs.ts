export interface ProgramRecord {
  title: string;
  description: string;
  image: string;
  alt: string;
  audience: 'kids-youth' | 'adults' | 'unspecified';
  audienceLabel: string;
  activity: 'art-mixed-media' | 'pottery' | 'creative-technology' | 'wellness-movement';
  activityLabel: string;
  format: 'class' | 'workshop' | 'camp' | 'after-school' | 'seasonal-pass';
  formatLabel: string;
  availability: 'registration' | 'interest-list' | 'seasonal' | 'check-schedule' | 'ended';
  status: string;
  statusTone: 'open' | 'interest' | 'seasonal' | 'check' | 'ended';
  href: string;
  action: string;
  external?: boolean;
}

const legacy = 'https://sparkpreneurs.github.io';

export const programs: ProgramRecord[] = [
  {
    title: '3D Printing',
    description: 'Turn digital ideas into physical objects through hands-on design, modelling, and making.',
    image: '/images/gallery-robotics.jpg',
    alt: 'A child taking part in a creative technology activity at SparkPreneurs',
    audience: 'kids-youth',
    audienceLabel: 'Kids & Youth',
    activity: 'creative-technology',
    activityLabel: 'Creative Technology',
    format: 'class',
    formatLabel: 'Six-session class',
    availability: 'registration',
    status: 'Registration available',
    statusTone: 'open',
    href: `${legacy}/3d-printing/`,
    action: 'View current registration',
    external: true,
  },
  {
    title: 'Pottery Wheel',
    description: 'Learn centring, shaping, and glazing in a guided four-session course for adults.',
    image: '/images/pottery-wheel-hero.png',
    alt: 'Pottery wheel course at SparkPreneurs',
    audience: 'adults',
    audienceLabel: 'Adults',
    activity: 'pottery',
    activityLabel: 'Pottery',
    format: 'class',
    formatLabel: 'Four-session class',
    availability: 'registration',
    status: 'Registration available',
    statusTone: 'open',
    href: '/pottery-wheel/',
    action: 'View program',
  },
  {
    title: 'Hand-Building Pottery',
    description: 'Shape clay by hand using pinching, coiling, slab-building, texture, and sculpture techniques.',
    image: '/images/hand-building-pottery.jpg',
    alt: 'Hand-building pottery course at SparkPreneurs',
    audience: 'adults',
    audienceLabel: 'Adults',
    activity: 'pottery',
    activityLabel: 'Pottery',
    format: 'class',
    formatLabel: 'Four-session class',
    availability: 'registration',
    status: 'Registration available',
    statusTone: 'open',
    href: '/hand-building-pottery/',
    action: 'View program',
  },
  {
    title: 'Zumba',
    description: 'An upbeat dance-fitness experience offered through individual sessions and seasonal passes.',
    image: '/images/zumba.jpg',
    alt: 'A movement class at SparkPreneurs',
    audience: 'unspecified',
    audienceLabel: 'Audience to be confirmed',
    activity: 'wellness-movement',
    activityLabel: 'Wellness & Movement',
    format: 'seasonal-pass',
    formatLabel: 'Session or seasonal pass',
    availability: 'check-schedule',
    status: 'Check current schedule',
    statusTone: 'check',
    href: `${legacy}/zumba/`,
    action: 'Check current schedule',
    external: true,
  },
  {
    title: 'Summer Camp',
    description: 'Creative school-break days combining art, making, movement, and time with new friends.',
    image: '/images/kids.jpg',
    alt: 'Children taking part in a SparkPreneurs activity',
    audience: 'kids-youth',
    audienceLabel: 'Children · confirm ages by session',
    activity: 'art-mixed-media',
    activityLabel: 'Creative Mix',
    format: 'camp',
    formatLabel: 'Camp',
    availability: 'ended',
    status: '2026 sessions ended',
    statusTone: 'ended',
    href: '/camps/summer-camp/',
    action: 'View Summer Camp status',
  },
  {
    title: 'After-School Program',
    description: 'Recurring weekday care with creative activities and three-, four-, or five-day weekly plans.',
    image: '/images/after-school-activity.png',
    alt: 'A creative after-school activity at SparkPreneurs',
    audience: 'kids-youth',
    audienceLabel: 'School-age children',
    activity: 'art-mixed-media',
    activityLabel: 'Creative Mix',
    format: 'after-school',
    formatLabel: 'After School',
    availability: 'registration',
    status: 'Registration available',
    statusTone: 'open',
    href: '/after-school/',
    action: 'View plans and details',
  },
  {
    title: 'Kids Workshops',
    description: 'Short, hands-on creative experiences featuring art, pottery, seasonal activities, and creative technology.',
    image: '/images/kids-workshops.png',
    alt: 'SparkPreneurs Summer Kids Workshops flyer featuring pottery and fabric painting',
    audience: 'kids-youth',
    audienceLabel: 'Kids & Youth · exact ages by workshop',
    activity: 'art-mixed-media',
    activityLabel: 'Creative Mix',
    format: 'workshop',
    formatLabel: 'Short workshop',
    availability: 'interest-list',
    status: 'Join the interest list',
    statusTone: 'interest',
    href: '/workshops/',
    action: 'Explore workshops',
  },
];

export const kidsYouthPrograms = programs.filter((program) => program.audience === 'kids-youth');
export const adultPrograms = programs.filter((program) => program.audience === 'adults');
