
import { Product, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Our Story', href: '#story' },
  { label: 'Menu', href: '#menu' },
  { label: 'Process', href: '#process' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' }
];

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  dish: string;
  avatar: string;
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Anjali Menon',
    location: 'Kochi',
    rating: 5,
    text: "The Kottayam Fish Curry brought back memories of my grandmother's kitchen. The clay pot makes a massive difference in the depth of flavor!",
    dish: 'Kottayam Fish Curry',
    avatar: 'https://i.pravatar.cc/150?u=anjali'
  },
  {
    id: 'r2',
    name: 'Rahul Varma',
    location: 'Bangalore',
    rating: 5,
    text: "Best Karimeen Pollichathu I've had outside of a houseboat. The spices are perfectly balanced and the fish was incredibly fresh.",
    dish: 'Karimeen Pollichathu',
    avatar: 'https://i.pravatar.cc/150?u=rahul'
  },
  {
    id: 'r3',
    name: 'Sarah Thomas',
    location: 'Dubai',
    rating: 4,
    text: "The Meenchatti itself is a work of art. I bought one to take back home, and the seasoning instructions from Chef Appu were spot on!",
    dish: 'Handcrafted Meenchatti',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kottayam Fish Curry',
    price: '₹549',
    description: 'Our signature red fish curry. Wild-caught Kingfish simmered in spicy Kudampuli gravy.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    category: 'curry',
    type: 'non-veg'
  },
  {
    id: '2',
    name: 'Handcrafted Meenchatti',
    price: '₹899',
    description: 'Heavy-duty seasoned clay pot. Retains heat and infuses seafood with natural minerals.',
    image: 'https://images.unsplash.com/photo-1621213176339-c7907d4d5db8?q=80&w=800&auto=format&fit=crop',
    category: 'claypot',
    type: 'veg'
  },
  {
    id: '3',
    name: 'Karimeen Pollichathu',
    price: '₹750',
    description: 'Backwater Pearl Spot marinated in ginger-garlic paste and slow-grilled in charred banana leaves.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97eb4?q=80&w=800&auto=format&fit=crop',
    category: 'special',
    type: 'non-veg'
  },
  {
    id: '4',
    name: 'Malabar Prawn Roast',
    price: '₹620',
    description: 'Tiger prawns tossed with caramelized onions, coconut chips, and black pepper.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop',
    category: 'curry',
    type: 'non-veg'
  },
  {
    id: '5',
    name: 'Appam (Set of 3)',
    price: '₹90',
    description: 'Fermented rice and coconut milk pancakes with lacy borders and soft centers.',
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc3a2?q=80&w=800&auto=format&fit=crop',
    category: 'sides',
    type: 'veg'
  }
];
