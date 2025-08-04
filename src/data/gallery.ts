export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/images/living-room.jpg',
    alt: 'Living Room',
    category: 'Living Room',
  },
  {
    id: '2',
    src: '/images/master-bedroom.jpg',
    alt: 'Master Bedroom',
    category: 'Master Bedroom',
  },
  {
    id: '3',
    src: '/images/kitchen.jpg',
    alt: 'Kitchen',
    category: 'Kitchen',
  },
  {
    id: '4',
    src: '/images/bathroom.jpg',
    alt: 'Bathroom',
    category: 'Bathroom',
  },
];
