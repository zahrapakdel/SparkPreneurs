import type { EventType, StudioRental } from './content-models';

const eventImage = { src: '/images/events.jpg', alt: 'A SparkPreneurs event setup with creative supplies' };
const reviewed = '2026-09-05';

export const eventTypes: EventType[] = [
  {
    id: 'birthday-parties', title: 'Birthday Parties', slug: 'birthday-parties',
    shortDescription: 'Hands-on celebrations with guided creative activities and room for friends, family, and cake.',
    audience: 'Birthday organizers, families, and supported adult groups',
    experienceIdeas: ['Art activity', 'Pottery activity', '3D printing activity', 'Movement or wellness activity'],
    confirmedFeatures: ['Guided creative activity options', 'Space for cake', 'A studio flow for making, gathering, photos, and celebration time'],
    planningPrompts: ['Preferred date and time', 'Guest count and age range', 'Creative activity interests', 'Cake, food, photo, or setup needs'],
    pricingMethod: 'custom-quote', inquirySubject: 'Birthday Party Inquiry', primaryImage: eventImage,
    seoTitle: 'Creative Birthday Parties | SparkPreneurs Toronto',
    seoDescription: 'Plan a creative birthday party with guided activities at the SparkPreneurs studio in Midtown Toronto.', lastReviewedDate: reviewed,
  },
  {
    id: 'private-events', title: 'Private Events', slug: 'private-events',
    shortDescription: 'Relaxed creative gatherings for milestones, family get-togethers, friend groups, and social occasions.',
    audience: 'Adults, families, friends, and private groups',
    experienceIdeas: ['Painting or mixed media', 'Pottery', '3D printing', 'Movement or wellness'],
    confirmedFeatures: ['Activity choices planned around the group', 'Custom event timing', 'Space for making, gathering, and photos'],
    planningPrompts: ['Occasion and preferred date', 'Guest count', 'Activity interests', 'Desired event flow and setup needs'],
    pricingMethod: 'custom-quote', inquirySubject: 'Private Event Inquiry', primaryImage: eventImage,
    seoTitle: 'Private Creative Events | SparkPreneurs Toronto',
    seoDescription: 'Plan a private creative gathering or milestone event at SparkPreneurs in Midtown Toronto.', lastReviewedDate: reviewed,
  },
  {
    id: 'corporate-events', title: 'Corporate Events', slug: 'corporate-events',
    shortDescription: 'Creative workshops, client gatherings, and studio-based team experiences planned around your organization.',
    audience: 'Businesses, team organizers, and client groups',
    experienceIdeas: ['Guided creative workshop', 'Pottery session', 'Collaborative art activity', 'Wellness or movement activity'],
    confirmedFeatures: ['Team-building and client-gathering formats', 'Activities planned around the group', 'Custom timing based on group size and activity'],
    planningPrompts: ['Organization and event objective', 'Preferred date and duration', 'Participant count', 'Activity, facilitation, and setup needs'],
    pricingMethod: 'custom-quote', inquirySubject: 'Corporate Event Inquiry', primaryImage: eventImage,
    seoTitle: 'Corporate Creative Events & Team Building | SparkPreneurs Toronto',
    seoDescription: 'Plan a creative corporate event, workshop, or team-building experience at SparkPreneurs in Toronto.', lastReviewedDate: reviewed,
  },
  {
    id: 'bridal-showers', title: 'Bridal Showers', slug: 'bridal-showers',
    shortDescription: 'A warm creative shower experience with pottery, art, and keepsake project possibilities.',
    audience: 'Bridal party organizers, friends, and family groups',
    experienceIdeas: ['Pottery project', 'Art activity', 'Collaborative or individual keepsakes', 'Creative photo moments'],
    confirmedFeatures: ['Creative activity options', 'Keepsake project possibilities', 'Space for making, gathering, photos, and celebration'],
    planningPrompts: ['Preferred date', 'Guest count', 'Pottery, art, or keepsake interests', 'Celebration and setup needs'],
    pricingMethod: 'custom-quote', inquirySubject: 'Bridal Shower Inquiry', primaryImage: eventImage,
    seoTitle: 'Creative Bridal Showers | SparkPreneurs Toronto',
    seoDescription: 'Plan a creative bridal shower with pottery, art, or keepsake activities at SparkPreneurs in Toronto.', lastReviewedDate: reviewed,
  },
];

export const getEventTypeBySlug = (slug: string) => eventTypes.find((eventType) => eventType.slug === slug);

export const studioRental: StudioRental = {
  title: 'Studio Rental', slug: 'studio-rental',
  shortDescription: 'Rent the SparkPreneurs studio when you primarily need flexible space rather than a hosted activity.',
  intendedUses: ['Artist or instructor sessions', 'Classes and workshops', 'Meetings', 'Photo sessions', 'Creative work', 'Community or private gatherings'],
  bookingDurations: ['Hourly rental', 'Daily rental'],
  confirmedFeatures: ['Midtown Toronto location', 'Flexible creative studio setting', 'Space suited to making, gathering, and photos'],
  questionsToConfirm: ['Availability for your date and duration', 'Capacity and room setup', 'Furniture, equipment, and amenities', 'Setup and cleanup time', 'Access and accessibility needs', 'Rates, deposit, insurance, cancellation, and permitted-use requirements'],
  pricingMethod: 'custom-quote', inquirySubject: 'Studio Rental Inquiry',
  primaryImage: { src: '/images/studio.jpg', alt: 'The SparkPreneurs studio space in Midtown Toronto' },
  location: 'yonge-studio', seoTitle: 'Studio Rental | SparkPreneurs Toronto',
  seoDescription: 'Ask about hourly or daily studio rental for classes, meetings, creative work, photos, and gatherings in Midtown Toronto.', lastReviewedDate: reviewed,
};
