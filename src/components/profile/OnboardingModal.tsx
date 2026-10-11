import React, { useState } from 'react';
import { Compass, MapPin, User, ArrowRight, Phone } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserProfile } from '../../types/profile';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onDismiss,
}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locality, setLocality] = useState('Pune');
  const [pinCode, setPinCode] = useState('411001');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote('Geolocation unsupported. Please confirm PIN code manually.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationNote(null);

    navigator.geolocation.getCurrentPosition(
      () => {
        setIsDetectingLocation(false);
        setLocationNote('Location resolved. Defaulting to Pune municipal region.');
        setLocality('Pune');
      },
      () => {
        setIsDetectingLocation(false);
        setLocationNote('Location access denied. Please enter your PIN code manually below.');
      },
      { timeout: 7000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: name.trim() || 'Local Citizen',
      phoneNumber: phoneNumber.trim(),
      locality: locality.trim() || 'Pune',
      pinCode: pinCode.trim() || '411001',
      hasCompletedOnboarding: true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      title="Welcome to CivicLens"
      subtitle="Hyperlocal civic news and municipal discovery"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-black/75 font-medium leading-relaxed">
          Select your municipal area to receive hyper-relevant notices about traffic, water supply interruptions, road repairs, and civic notices.
        </p>

        {/* Name */}
        <div>
          <label className="block text-xs font-black uppercase text-black mb-1 flex items-center gap-1.5">
            <User size={13} className="text-[#FA541C]" />
            <span>Your Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aditya"
            className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Optional Phone */}
        <div>
          <label className="block text-xs font-black uppercase text-black mb-1 flex items-center gap-1.5">
            <Phone size={13} className="text-[#FA541C]" />
            <span>Phone Number (Optional demo field)</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="text-[10px] text-black/60 font-medium block mt-0.5">
            Demo profile stored locally in browser. No phone verification performed.
          </span>
        </div>

        {/* Locality & PIN */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#FA541C]" />
              <span>Locality</span>
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Pune"
              required
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1 flex items-center gap-1.5">
              <Compass size={13} className="text-[#FA541C]" />
              <span>PIN Code</span>
            </label>
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="e.g. 411001"
              maxLength={6}
              required
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Location prompt button */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRequestLocation}
            isLoading={isDetectingLocation}
            icon={<Compass size={14} />}
            className="w-full text-xs font-black uppercase"
          >
            Detect My Locality (One-Time)
          </Button>
          {locationNote && (
            <p className="text-[11px] text-black font-bold mt-1.5">
              {locationNote}
            </p>
          )}
        </div>

        {/* Modal Submit */}
        <div className="pt-3 border-t-2 border-black/10 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
            Skip for Now
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<ArrowRight size={15} />}
            iconPosition="right"
            className="bg-black text-[#D4FF00] font-black uppercase tracking-wider"
          >
            Start Exploring
          </Button>
        </div>
      </form>
    </Modal>
  );
};
