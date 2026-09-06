export type Audience = 'kids-youth' | 'adults' | 'all-ages' | 'unspecified';

export type Activity =
  | 'art-mixed-media'
  | 'pottery'
  | 'creative-technology'
  | 'wellness-movement';

export type ProgramFormat = 'class' | 'workshop' | 'camp' | 'after-school' | 'seasonal-pass';
export type AvailabilityMode = 'registration' | 'interest' | 'inquiry' | 'paused';
export type OfferingStatus = 'open' | 'upcoming' | 'waitlist' | 'full' | 'ended' | 'cancelled';
export type RegistrationMode = 'checkout' | 'external' | 'interest' | 'inquiry';
export type PublicationStatus = 'published' | 'planned';
export type LocationId = 'yonge-studio';

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Evergreen editorial content. Prices, dates, and registration state do not belong here. */
export interface Program {
  id: string;
  title: string;
  slug: string;
  canonicalPath: string;
  publicationStatus: PublicationStatus;
  legacyUrl?: string;
  shortDescription: string;
  overview: string;
  primaryAudience: Audience;
  additionalAudiences?: Audience[];
  minimumAge: number | null;
  maximumAge: number | null;
  primaryActivity: Activity;
  activityTags: Activity[];
  format: ProgramFormat;
  experienceLevel?: string;
  sessionOverview: string;
  learningOrExperienceHighlights: string[];
  inclusions: string[];
  materialsOrPreparation?: string[];
  firingAndPickupDetails?: string;
  location: LocationId;
  availabilityMode: AvailabilityMode;
  primaryImage: ImageAsset;
  galleryImages?: ImageAsset[];
  faqs?: FaqItem[];
  relatedPrograms?: string[];
  seoTitle: string;
  seoDescription: string;
  lastReviewedDate: string;
}

/** A dated, selectable, or interest-based instance of one Program. */
export interface Offering {
  id: string;
  programId: Program['id'];
  programCode: string | null;
  itemCode: string | null;
  label: string;
  status: OfferingStatus;
  startDate: string | null;
  endDate: string | null;
  sessionDates: string[];
  dayOfWeek: string | null;
  startTime: string | null;
  endTime: string | null;
  numberOfSessions: number | null;
  duration: string | null;
  minimumAge?: number | null;
  maximumAge?: number | null;
  capacityDisplay?: string;
  spacesRemainingDisplay?: string;
  /** Display-only amount in cents. The checkout backend remains authoritative. */
  price: number | null;
  currency: 'CAD';
  taxDisplay: string | null;
  displayDataLastSynced: string;
  discountLabel?: string;
  originalPrice?: number;
  includedItems?: string[];
  registrationMode: RegistrationMode;
  registrationUrl?: string;
  registrationOpenDate?: string | null;
  registrationCloseDate?: string | null;
  location: LocationId;
  businessNotes?: string;
}

export interface EventType {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  audience: string;
  experienceIdeas: string[];
  confirmedFeatures: string[];
  planningPrompts: string[];
  pricingMethod: 'custom-quote';
  inquirySubject: string;
  primaryImage: ImageAsset;
  seoTitle: string;
  seoDescription: string;
  lastReviewedDate: string;
}

export interface StudioRental {
  title: string;
  slug: string;
  shortDescription: string;
  intendedUses: string[];
  bookingDurations: string[];
  confirmedFeatures: string[];
  questionsToConfirm: string[];
  pricingMethod: 'custom-quote';
  inquirySubject: string;
  primaryImage: ImageAsset;
  location: LocationId;
  seoTitle: string;
  seoDescription: string;
  lastReviewedDate: string;
}
