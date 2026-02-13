import { QuizPreferences, UserProfile } from '../types';

const KEYS = {
  QUIZ: 'second_sole_quiz_data',
  USER: 'second_sole_user_data',
  CART: 'second_sole_cart',
};

// Initialize default user data if not present
const DEFAULT_USER: UserProfile = {
  name: 'Runner',
  currentShoeName: 'Add a shoe...',
  currentShoeMileage: 0,
  shoeLimit: 350,
  checkIns: [],
};

export const StorageService = {
  saveQuizResults: (results: QuizPreferences) => {
    try {
      localStorage.setItem(KEYS.QUIZ, JSON.stringify(results));
    } catch (e) {
      console.error('Failed to save quiz locally', e);
    }
  },

  getQuizResults: (): QuizPreferences | null => {
    try {
      const data = localStorage.getItem(KEYS.QUIZ);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  getUserProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      // Merge with default to ensure new fields (like checkIns) exist for old data
      return data ? { ...DEFAULT_USER, ...JSON.parse(data) } : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  },

  saveUserProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
  },

  wipeAllData: () => {
    localStorage.removeItem(KEYS.QUIZ);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.CART);
    // Reload to reflect changes
    window.location.reload();
  }
};