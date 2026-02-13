export interface Shoe {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'Road' | 'Trail' | 'Hybrid';
  stability: 'Neutral' | 'Stability';
  cushion: 'Firm' | 'Balanced' | 'Maximal';
  widthOptions: ('Standard' | 'Wide' | 'Extra Wide')[];
  image: string;
  description: string;
  staffPick?: boolean;
}

export interface QuizPreferences {
  terrain: 'Road' | 'Trail' | 'Hybrid' | null;
  stability: 'Neutral' | 'Stability' | 'Supination' | null; // Mapped from stride question
  cushion: 'Firm' | 'Balanced' | 'Maximal' | null;
  mileage: 'Low' | 'Medium' | 'High' | null;
  width: 'Standard' | 'Wide' | null;
  brands: string[];
}

export interface Event {
  id: string;
  title: string;
  day: string;
  time: string;
  location: string;
  type: 'Club Run' | 'Trail Run' | 'Long Run' | 'Speed Work' | 'Social Run';
}

export interface Trail {
  id: string;
  name: string;
  type: 'Paved' | 'Trails' | 'Mixed';
  distance: string;
  image: string;
}

export interface UserProfile {
  name: string;
  currentShoeName: string;
  currentShoeImage?: string;
  currentShoeMileage: number;
  shoeLimit: number;
  checkIns: string[];
}