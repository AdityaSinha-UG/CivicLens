import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Compass,
  Check,
  RotateCcw,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { Button } from '../common/Button';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetProfile: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [locatingStatus, setLocatingStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocatingStatus('Device geolocation is not supported in this browser. Please enter PIN code manually.');
      setFormData((prev) => ({ ...prev, locationPermissionState: 'unsupported' }));
      return;
    }

    setLocatingStatus('Requesting one-time location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // One-time approximate resolution
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        setLocatingStatus(`One-time location detected (${lat}, ${lon}). Retaining Pune municipal locality for MVP demo.`);
        setFormData((prev) => ({
          ...prev,
          locality: 'Pune',
          locationPermissionState: 'granted',
        }));
      },
      (error) => {
        console.warn('Geolocation permission denied or error:', error.message);
        setLocatingStatus('Location permission denied or unavailable. You can enter your locality or PIN code manually below.');
        setFormData((prev) => ({
          ...prev,
          locationPermissionState: 'denied',
        }));
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Editorial Title Banner */}
      <div className="pb-4 border-b border-[#E5D3C2]">
        <h2 className="font-serif text-2xl font-bold text-[#292923]">
          Profile & Locality Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#615E52] mt-1">
          Manage your demo citizen profile and default neighbourhood for local civic discovery.
        </p>
      </div>

      {/* Security & Authentication Disclaimer */}
      <div className="p-4 bg-[#F8EFE5] border border-[#E5D3C2] rounded-xl text-xs text-[#615E52] flex items-start gap-3">
        <Lock size={17} className="text-[#315B48] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#292923] block mb-0.5">
            Demo Local Profile (No Cloud Database)
          </strong>
          This profile is stored entirely inside your browser's local storage. It does not represent a server-side authenticated account, and phone numbers are not verified via SMS OTP in this MVP.
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-[#FFF9F4] border border-[#E5D3C2] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#615E52] mb-1.5 flex items-center gap-1.5">
            <User size={14} className="text-[#315B48]" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Aditya Sharma"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5D3C2] bg-white text-sm text-[#292923] focus:outline-none focus:ring-2 focus:ring-[#315B48]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#615E52] mb-1.5 flex items-center gap-1.5">
            <Phone size={14} className="text-[#315B48]" />
            <span>Phone Number (Optional for Demo)</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5D3C2] bg-white text-sm text-[#292923] focus:outline-none focus:ring-2 focus:ring-[#315B48]"
          />
          <p className="text-[11px] text-[#827E70] mt-1">
            Demo field only. Unverified. Never shared or sent to external servers.
          </p>
        </div>

        {/* Locality & PIN Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#615E52] mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#315B48]" />
              <span>Locality / City</span>
            </label>
            <input
              type="text"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              placeholder="e.g. Pune"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5D3C2] bg-white text-sm text-[#292923] focus:outline-none focus:ring-2 focus:ring-[#315B48]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#615E52] mb-1.5 flex items-center gap-1.5">
              <Compass size={14} className="text-[#315B48]" />
              <span>Postal PIN Code</span>
            </label>
            <input
              type="text"
              value={formData.pinCode}
              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
              placeholder="e.g. 411001"
              maxLength={6}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5D3C2] bg-white text-sm text-[#292923] focus:outline-none focus:ring-2 focus:ring-[#315B48]"
            />
          </div>
        </div>

        {/* Device Location Helper */}
        <div className="p-4 rounded-xl bg-[#F5EAE0] border border-[#E5D3C2] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#292923] block">
                Automatic Geolocation Permission
              </span>
              <span className="text-[11px] text-[#615E52] block">
                Requests one-time device location when needed; no continuous tracking.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRequestLocation}
              icon={<Compass size={14} />}
            >
              Request One-Time Location
            </Button>
          </div>

          {locatingStatus && (
            <p className="text-xs text-[#315B48] font-medium pt-1">
              {locatingStatus}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-3 border-t border-[#E5D3C2] flex flex-wrap items-center justify-between gap-3">
          <Button
            type="submit"
            variant="primary"
            icon={isSaved ? <Check size={16} /> : undefined}
          >
            {isSaved ? 'Preferences Saved!' : 'Save Profile Changes'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetProfile}
            icon={<RotateCcw size={14} />}
            className="text-[#615E52]"
          >
            Reset to Default
          </Button>
        </div>
      </form>
    </div>
  );
};
