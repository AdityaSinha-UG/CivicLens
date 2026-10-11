import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Compass,
  Check,
  RotateCcw,
  Lock,
  LogOut,
  Edit3,
  ShieldCheck,
  Radio,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetProfile: () => void;
  onSignOut: () => void;
  onOpenLocalityModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetProfile,
  onSignOut,
  onOpenLocalityModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSavedBanner, setIsSavedBanner] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [locatingStatus, setLocatingStatus] = useState<string | null>(null);

  // Derive user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'CL';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 4000);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Editorial Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-black/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black text-[#D4FF00]">
              <ShieldCheck size={13} />
              <span>CITIZEN PROFILE</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-black/80">
              {profile.locality} Dispatch Pass
            </span>
          </div>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-black text-black tracking-tight mt-2">
            Your Civic ID Pass
          </h2>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData(profile);
                setIsEditing(true);
              }}
              icon={<Edit3 size={15} />}
              className="bg-white hover:bg-black hover:text-white font-black uppercase text-xs tracking-wider border-2 border-black shadow-[0_3px_0_0_#121212]"
            >
              Edit Details
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-black hover:bg-black/10 font-bold text-xs"
            >
              Cancel Edit
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSignOutModalOpen(true)}
            icon={<LogOut size={15} className="text-[#DC2626]" />}
            className="bg-white hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] text-black font-black uppercase text-xs tracking-wider border-2 border-black shadow-[0_3px_0_0_#121212]"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Success Banner when changes are saved */}
      {isSavedBanner && (
        <div className="p-4 bg-white border-2 border-black rounded-3xl text-sm font-bold text-black flex items-center gap-3 shadow-[0_6px_0_0_#121212] animate-in fade-in slide-in-from-top-2">
          <div className="w-8 h-8 rounded-full bg-[#D4FF00] border border-black flex items-center justify-center shrink-0">
            <Check size={18} className="text-black" />
          </div>
          <p className="leading-snug">
            Your profile details and active locality have been saved successfully!
          </p>
        </div>
      )}

      {/* HERO SECTION: The Beautiful Citizen Pass Identity Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-black bg-white shadow-[0_12px_0_0_#121212]">
        {/* Pass Top Banner */}
        <div className="bg-black text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
          {/* Subtle Gen Z background watermark */}
          <div className="absolute right-[-20px] top-[-20px] font-['Syne'] text-8xl font-black text-white/5 pointer-events-none select-none">
            PASS
          </div>

          <div className="flex items-center gap-4 z-10">
            {/* Citizen Avatar with Initials */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FA541C] border-2 border-black text-white flex items-center justify-center font-['Syne'] text-2xl sm:text-3xl font-black shadow-[0_4px_0_0_#121212] shrink-0">
              {getInitials(profile.name)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4FF00] text-black">
                  VERIFIED CITIZEN
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
                  ID: CL-2026-{profile.pinCode || '411001'}
                </span>
              </div>
              <h3 className="font-['Syne'] text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
                {profile.name || 'Local Citizen'}
              </h3>
              <p className="text-xs text-white/70 font-medium mt-0.5 flex items-center gap-1.5">
                <Radio size={12} className="text-[#D4FF00] animate-pulse" />
                <span>Hyperlocal News Discovery Enabled</span>
              </p>
            </div>
          </div>

          <div className="z-10 flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-white/15 pt-3 sm:pt-0">
            <span className="text-[10px] font-mono uppercase text-white/60 tracking-wider">
              MUNICIPAL WARD
            </span>
            <span className="text-base sm:text-lg font-black text-[#D4FF00] font-['Syne']">
              {profile.locality}
            </span>
          </div>
        </div>

        {/* Pass Details Grid: Shows Full Name, Number, and Locality */}
        <div className="p-6 sm:p-8 bg-[#FFF8F4] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Full Name Block */}
            <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[0_4px_0_0_#121212]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/60 block flex items-center gap-1.5 mb-1">
                <User size={13} className="text-[#FA541C]" />
                Full Legal / Citizen Name
              </span>
              <span className="text-base font-extrabold text-black block truncate">
                {profile.name || 'Not specified'}
              </span>
              <span className="text-[11px] text-black/50 mt-1 block">
                Local display profile
              </span>
            </div>

            {/* Phone Number Block */}
            <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[0_4px_0_0_#121212]">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/60 block flex items-center gap-1.5 mb-1">
                <Phone size={13} className="text-[#FA541C]" />
                Registered Contact Number
              </span>
              <span className="text-base font-extrabold text-black block truncate font-mono">
                {profile.phoneNumber || 'None provided'}
              </span>
              <span className="text-[11px] text-[#FA541C] font-bold mt-1 block">
                {profile.phoneNumber ? 'Local device contact' : 'Optional for alerts'}
              </span>
            </div>

            {/* Locality & PIN Code Block */}
            <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[0_4px_0_0_#121212]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#FA541C]" />
                  Active Locality & PIN
                </span>
                {onOpenLocalityModal && (
                  <button
                    onClick={onOpenLocalityModal}
                    className="text-[10px] font-black text-black hover:text-[#FA541C] underline uppercase cursor-pointer"
                  >
                    Switch
                  </button>
                )}
              </div>
              <span className="text-base font-extrabold text-black block truncate">
                {profile.locality} ({profile.pinCode || '411001'})
              </span>
              <span className="text-[11px] text-black/50 mt-1 block">
                Ward postal code
              </span>
            </div>
          </div>

          {/* Civic Subscriptions & Preferences Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-black shadow-[0_4px_0_0_#121212]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FA541C]" />
                Monitored Civic Streams for {profile.locality}
              </span>
              <span className="text-[11px] font-mono font-bold bg-[#D4FF00] text-black px-2 py-0.5 rounded-full border border-black">
                7 OF 7 CHANNELS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-black">
              {[
                'Traffic & Metro',
                'Water Supply',
                'Road Repair Works',
                'Disaster & Flood',
                'Ward Notifications',
                'Public Safety',
                'Community Park',
              ].map((channel, i) => (
                <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FFF2E8] border border-black/20">
                  <CheckCircle2 size={13} className="text-[#FA541C] shrink-0" />
                  <span className="truncate">{channel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE SECTION (Visible when user clicks 'Edit Details') */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_0_#121212] space-y-5 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
            <h4 className="font-['Syne'] text-xl font-black text-black">
              Update Citizen Information
            </h4>
            <span className="text-xs text-black/60 font-semibold">
              Edits persist to local storage
            </span>
          </div>

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
              className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-[#FA541C]" />
              <span>Contact Phone Number</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-[11px] text-black/60 font-medium mt-1">
              Local demo field. Never transmitted to third-party marketing services.
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
                className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
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
                className="w-full px-4 py-3 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* One-time Device Location Helper */}
          <div className="p-4 rounded-2xl bg-[#FFF2E8] border-2 border-black space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black uppercase text-black block">
                  One-Time Device Geolocation
                </span>
                <span className="text-[11px] text-black/70 font-medium block">
                  Verify current neighbourhood coordinates without continuous background tracking.
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
                Detect Location
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
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="primary"
                icon={<Check size={16} />}
                className="bg-black text-[#D4FF00] hover:bg-[#FA541C] hover:text-white font-black uppercase text-xs tracking-wider"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-black/70 font-bold"
              >
                Cancel
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetProfile}
              icon={<RotateCcw size={14} />}
              className="text-black/60 hover:text-black font-bold text-xs"
            >
              Reset to Defaults
            </Button>
          </div>
        </form>
      )}

      {/* Security & Authentication Disclaimer Card */}
      <div className="p-4 bg-white border-2 border-black rounded-3xl text-xs text-black/80 flex items-start gap-3 shadow-[0_6px_0_0_#121212]">
        <div className="p-2 rounded-xl bg-black text-[#D4FF00] shrink-0 mt-0.5">
          <Lock size={16} />
        </div>
        <div className="leading-relaxed">
          <strong className="text-black block mb-0.5 font-bold uppercase text-[11px] tracking-wider">
            Browser-Local Session Note
          </strong>
          This demo profile is kept in your device browser's local cache. Signing out resets stored credentials and lets you reconfigure a fresh profile.
        </div>
      </div>

      {/* SIGN OUT CONFIRMATION MODAL */}
      <Modal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        title="Sign Out of CivicLens"
        subtitle="Confirm citizen profile sign out"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-[#FEE2E2] border-2 border-black rounded-2xl text-xs text-black">
            <AlertTriangle size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">
              Are you sure you want to sign out? This will reset your local profile details on this browser and allow you to set up a new citizen profile.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black/10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSignOutModalOpen(false)}
              className="font-bold text-xs"
            >
              Stay Signed In
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                setIsSignOutModalOpen(false);
                onSignOut();
              }}
              icon={<LogOut size={15} />}
              className="font-black uppercase text-xs tracking-wider"
            >
              Confirm Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
