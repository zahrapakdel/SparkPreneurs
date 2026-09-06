export type GalleryCategory = 'programs' | 'camps' | 'events' | 'studio';

export interface GalleryItem {
  src: string;
  alt: string;
  category: GalleryCategory;
  caption: string;
  href?: string;
}

export const galleryItems: GalleryItem[] = [
  { src: '/images/gallery-kids-clay.jpg', alt: 'Children showing clay projects at SparkPreneurs', category: 'programs', caption: 'Kids clay projects', href: '/programs/kids-youth/' },
  { src: '/images/gallery-pottery.jpg', alt: 'An adult shaping clay by hand at SparkPreneurs', category: 'programs', caption: 'Adult pottery', href: '/programs/pottery/' },
  { src: '/images/pottery-wheel-hero.png', alt: 'A participant shaping clay on a pottery wheel', category: 'programs', caption: 'Pottery Wheel', href: '/programs/pottery-wheel/' },
  { src: '/images/hand-building-pottery.jpg', alt: 'Hand-building pottery work at SparkPreneurs', category: 'programs', caption: 'Hand-Building Pottery', href: '/programs/hand-building-pottery/' },
  { src: '/images/gallery-robotics.jpg', alt: 'A child working on a creative technology project', category: 'programs', caption: 'Creative technology', href: '/programs/3d-printing/' },
  { src: '/images/zumba.jpg', alt: 'A lively movement class at SparkPreneurs', category: 'programs', caption: 'Zumba', href: '/programs/zumba/' },
  { src: '/images/after-school-activity.png', alt: 'A creative after-school activity at SparkPreneurs', category: 'programs', caption: 'After School', href: '/after-school/' },
  { src: '/images/kids-workshops.png', alt: 'SparkPreneurs kids workshop program artwork', category: 'programs', caption: 'Kids workshops', href: '/workshops/' },
  { src: '/images/summer-camp-week-1.png', alt: 'Summer Camp Young Chef Creations program artwork', category: 'camps', caption: 'Young Chef Creations', href: '/camps/summer-camp/' },
  { src: '/images/summer-camp-week-2.png', alt: 'Summer Camp 3D Storybook Makers program artwork', category: 'camps', caption: '3D Storybook Makers', href: '/camps/summer-camp/' },
  { src: '/images/summer-camp-week-3.png', alt: 'Summer Camp Around the World program artwork', category: 'camps', caption: 'Around the World', href: '/camps/summer-camp/' },
  { src: '/images/summer-camp-week-4.png', alt: 'Summer Camp Dream House Designers program artwork', category: 'camps', caption: 'Dream House Designers', href: '/camps/summer-camp/' },
  { src: '/images/summer-camp-week-5.png', alt: 'Summer Camp Fashion Week program artwork', category: 'camps', caption: 'Fashion Week', href: '/camps/summer-camp/' },
  { src: '/images/events.jpg', alt: 'A SparkPreneurs event setup with creative supplies', category: 'events', caption: 'Creative gatherings' },
  { src: '/images/studio.jpg', alt: 'The SparkPreneurs studio space in Midtown Toronto', category: 'studio', caption: 'The studio' },
  { src: '/images/hero-collage.jpg', alt: 'A collage of creative experiences at SparkPreneurs', category: 'studio', caption: 'Creative moments' },
];
