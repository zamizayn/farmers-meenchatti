
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string; // Relaxed to string to allow dynamic categories
  type: 'veg' | 'non-veg';
  isHighlighted?: boolean;
  highlightTagline?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface VideoReview {
  id: string;
  name: string;
  youtubeLink: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface NavItem {
  label: string;
  href: string;
}
