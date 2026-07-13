export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  avatarAlt: string;
  rating: number;
}

export interface OpeningHour {
  label: string;
  hours: string;
}
