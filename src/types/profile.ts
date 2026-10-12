export interface UserProfile {
  name: string;
  phoneNumber: string;
  locality: string;
  pinCode: string;
  formattedAddress?: string;
  hasCompletedOnboarding: boolean;
  locationPermissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Local Citizen',
  phoneNumber: '',
  locality: 'Pune',
  pinCode: '411001',
  hasCompletedOnboarding: false,
  locationPermissionState: 'prompt',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
