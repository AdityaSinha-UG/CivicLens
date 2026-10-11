import { UserProfile, DEFAULT_PROFILE } from '../types/profile';

const PROFILE_STORAGE_KEY = 'civiclens_demo_profile_v1';

export const storageService = {
  getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return DEFAULT_PROFILE;
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('Could not read user profile from localStorage:', e);
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      const updated = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save user profile to localStorage:', e);
    }
  },

  resetProfile(): void {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not reset user profile:', e);
    }
  }
};
