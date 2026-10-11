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
      <div className="pb-4 border-b-2 border-black/15">
        <h2 className="font-['Syne'] text-3xl sm:text-4xl font-black text-black">
          Profile & Locality
        </h2>
        <p className="text-xs sm:text-sm text-black/80 font-medium mt-1">
          Manage your local demo profile and default neighbourhood for local civic discovery.
        </p>
      </div>

      {/* Security & Authentication Disclaimer */}
      <div className="p-4 bg-white border-2 border-black rounded-3xl text-xs text-black/80 flex items-start gap-3 shadow-[0_6px_0_0_#121212]">
        <div className="p-2 rounded-xl bg-black text-[#D4FF00] shrink-0 mt-0.5">
          <Lock size={16} />
        </div>
        <div className="leading-relaxed">
          <strong className="text-black block mb-0.5 font-bold uppercase text-[11px] tracking-wider">
            Browser-Local Demo Profile (No Cloud Database)
          </strong>
          This profile is stored securely inside your browser's local storage. It does not represent a server-side authenticated account, and phone numbers are not verified via SMS OTP in this MVP.
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_0_#121212] space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
            <User size={14} className="text-[#FA541C]" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Aditya Sharma"
            required
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
            <Phone size={14} className="text-[#FA541C]" />
            <span>Phone Number (Optional for Demo)</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-[11px] text-black/60 font-medium mt-1">
            Demo field only. Unverified. Never shared or sent to external servers.
          </p>
        </div>

        {/* Locality & PIN Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#FA541C]" />
              <span>Locality / City</span>
            </label>
            <input
              type="text"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              placeholder="e.g. Pune"
              required
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
              <Compass size={14} className="text-[#FA541C]" />
              <span>Postal PIN Code</span>
            </label>
            <input
              type="text"
              value={formData.pinCode}
              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
              placeholder="e.g. 411001"
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Device Location Helper */}
        <div className="p-4 rounded-2xl bg-[#FFF2E8] border-2 border-black space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase text-black block">
                Automatic Geolocation
              </span>
              <span className="text-[11px] text-black/70 font-medium block">
                Requests one-time device location when needed; no continuous tracking.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRequestLocation}
              icon={<Compass size={14} />}
              className="bg-white hover:bg-black hover:text-white font-black text-xs"
            >
              Request Location
            </Button>
          </div>

          {locatingStatus && (
            <p className="text-xs text-black font-bold pt-1">
              {locatingStatus}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-3 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="submit"
            variant="primary"
            icon={isSaved ? <Check size={16} /> : undefined}
            className="bg-black text-[#D4FF00] hover:bg-white hover:text-black font-black uppercase text-xs tracking-wider"
          >
            {isSaved ? 'Preferences Saved!' : 'Save Profile Changes'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetProfile}
            icon={<RotateCcw size={14} />}
            className="text-black/70 hover:text-black font-bold"
          >
            Reset to Default
          </Button>
        </div>
      </form>
    </div>
  );
};
