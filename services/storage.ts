import { UserProfile, CartItem, LocalStorageSchema, GaitProfile, ShoeRotationItem } from '../types';

const STORAGE_KEY = 'second_sole_medina_data';

// CRITICAL FIX: Changed from a constant object to a function.
// This prevents the "Zombie State" where Guest Mode persists in memory after a wipe.
const getDefaultData = (): LocalStorageSchema => ({
  profile: {
    name: '',
    email: '',
    isGuest: false,
    attendanceCount: 0,
    milesRun: 0
  },
  gaitProfile: {},
  rotation: [],
  cart: [],
  privacyAudit: {
    lastWipe: null,
    storageUsed: '0KB'
  },
  isAuthenticated: false
});

const getStorage = (): LocalStorageSchema => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    
    // SAFETY MERGE: This ensures that if the saved data is missing new fields (like rotation),
    // they are filled in from the default data. This fixes "undefined" errors causing button failures.
    const parsed = JSON.parse(raw);
    return { ...getDefaultData(), ...parsed };
  } catch (e) {
    console.error("Storage Error", e);
    return getDefaultData();
  }
};

const setStorage = (data: LocalStorageSchema) => {
  // Calculate storage used roughly
  const jsonString = JSON.stringify(data);
  const bytes = new Blob([jsonString]).size;
  
  // Ensure privacyAudit exists before assigning (safety check)
  if (!data.privacyAudit) {
      data.privacyAudit = getDefaultData().privacyAudit;
  }
  data.privacyAudit.storageUsed = `${(bytes / 1024).toFixed(2)}KB`;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const storageService = {
  getProfile: (): UserProfile => getStorage().profile,
  
  updateProfile: (updates: Partial<UserProfile>) => {
    const data = getStorage();
    data.profile = { ...data.profile, ...updates };
    setStorage(data);
    return data.profile;
  },

  getGaitProfile: (): GaitProfile => getStorage().gaitProfile,

  updateGaitProfile: (updates: Partial<GaitProfile>) => {
    const data = getStorage();
    data.gaitProfile = { ...data.gaitProfile, ...updates };
    setStorage(data);
  },

  getRotation: (): ShoeRotationItem[] => getStorage().rotation,

  addToRotation: (shoe: ShoeRotationItem) => {
    const data = getStorage();
    data.rotation.push(shoe);
    setStorage(data);
  },

  updateRotationShoe: (id: string, milesToAdd: number) => {
    const data = getStorage();
    const shoe = data.rotation.find(s => s.id === id);
    if (shoe) {
      shoe.miles += milesToAdd;
      setStorage(data);
    }
  },

  removeRotationShoe: (id: string) => {
    const data = getStorage();
    // Filter out the shoe with the matching ID
    data.rotation = data.rotation.filter(s => s.id !== id);
    setStorage(data);
  },

  getCart: (): CartItem[] => getStorage().cart,

  addToCart: (item: CartItem) => {
    const data = getStorage();
    const existingIndex = data.cart.findIndex(i => i.shoeId === item.shoeId && i.size === item.size);
    
    if (existingIndex > -1) {
      data.cart[existingIndex].quantity += item.quantity;
    } else {
      data.cart.push(item);
    }
    setStorage(data);
  },

  removeFromCart: (shoeId: string, size: number) => {
    const data = getStorage();
    data.cart = data.cart.filter(i => !(i.shoeId === shoeId && i.size === size));
    setStorage(data);
  },
  
  clearCart: () => {
    const data = getStorage();
    data.cart = [];
    setStorage(data);
  },

  isAuthenticated: () => getStorage().isAuthenticated,

  setAuthenticated: (status: boolean) => {
    const data = getStorage();
    data.isAuthenticated = status;
    setStorage(data);
  },

  rsvpEvent: () => {
    const data = getStorage();
    data.profile.attendanceCount = (data.profile.attendanceCount || 0) + 1;
    setStorage(data);
  },

  getPrivacyAudit: () => getStorage().privacyAudit,
  
  wipeData: () => {
    localStorage.removeItem(STORAGE_KEY);
    // Force a reload to clear React state and memory
    window.location.reload();
  },
  
  getRawData: () => getStorage()
};