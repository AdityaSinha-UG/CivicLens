import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  User,
  Compass,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Radio,
  Building2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserProfile } from '../../types/profile';
import { postalService, PostalLocationResult } from '../../services/postalService';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
  onDismiss: () => void;
}

type OnboardingStep = 'phone' | 'details';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onDismiss,
}) => {
  const [step, setStep] = useState<OnboardingStep>('phone');

  // Step 1: Phone number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);

  // Step 2: Name & PIN code
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [pinCode, setPinCode] = useState('411001');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const [postalResult, setPostalResult] = useState<PostalLocationResult | null>(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState<string>('');

  // Automatically lookup default PIN code on initial mount or when step changes
  useEffect(() => {
    if (step === 'details' && pinCode.length === 6 && !postalResult) {
      handlePincodeLookup(pinCode);
    }
  }, [step]);

  // Handle PIN code lookup
  const handlePincodeLookup = async (code: string) => {
    const trimmed = code.trim();
    if (trimmed.length !== 6) {
      setPostalResult(null);
      setPinError(null);
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
      setPinError('PIN code must be a 6-digit Indian postal code starting with 1-9.');
      setPostalResult(null);
      return;
    }

    setIsLookingUpPin(true);
    setPinError(null);

    try {
      const result = await postalService.lookupPincode(trimmed);
      setPostalResult(result);
      setSelectedPostOffice(result.postOffices[0] || result.locality);
      setPinError(null);
    } catch (err: unknown) {
      setPostalResult(null);
      const msg = err instanceof Error ? err.message : 'Unable to verify postal code.';
      setPinError(msg);
    } finally {
      setIsLookingUpPin(false);
    }
  };

  // Step 1: Validate Indian phone number (10 digits starting with 6-9)
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const digitsOnly = phoneNumber.replace(/\D/g, '');

    if (!digitsOnly) {
      setPhoneError('Please enter your 10-digit mobile number.');
      return;
    }

    if (digitsOnly.length !== 10) {
      setPhoneError(`Please enter exactly 10 digits (currently ${digitsOnly.length}).`);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      setPhoneError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsPhoneSubmitting(true);
    // Smooth transition to next step
    setTimeout(() => {
      setIsPhoneSubmitting(false);
      setStep('details');
    }, 250);
  };

  // Step 2: Validate details & complete onboarding
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Please enter your name.');
      return;
    }

    if (!postalResult) {
      setPinError('Please enter a verified 6-digit postal PIN code.');
      return;
    }

    const localityToSave = postalResult.district || postalResult.locality || 'Pune';
    const formattedAddressToSave = selectedPostOffice
      ? `${selectedPostOffice}, ${postalResult.district}, ${postalResult.state}`
      : postalResult.formattedAddress;

    onComplete({
      name: trimmedName,
      phoneNumber: `+91 ${phoneNumber.replace(/\D/g, '')}`,
      locality: localityToSave,
      pinCode: postalResult.pincode,
      formattedAddress: formattedAddressToSave,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      title={step === 'phone' ? 'Welcome to CivicLens' : 'Citizen Profile Setup'}
      subtitle={
        step === 'phone'
          ? 'Hyperlocal news and verified municipal discovery'
          : 'Step 2 of 2 • Name & Locality Verification'
      }
      maxWidth="md"
    >
      {step === 'phone' ? (
        /* SCREEN A: WELCOME & PHONE NUMBER */
        <div className="space-y-5">
          {/* Hero Editorial Banner inspired by quick-commerce simplicity with CivicLens branding */}
          <div className="relative overflow-hidden rounded-2xl bg-black text-white p-5 border-2 border-black shadow-[0_6px_0_0_#121212]">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FA541C] text-white">
                <Radio size={11} className="animate-pulse" />
                <span>HYPERLOCAL RADAR</span>
              </span>
              <span className="text-[10px] font-mono text-[#D4FF00] font-bold">
                100% VERIFIED
              </span>
            </div>

            <h3 className="font-['Syne'] text-xl sm:text-2xl font-black text-white leading-tight">
              Your Neighbourhood, In Real Time.
            </h3>
            <p className="text-xs text-white/80 font-medium mt-1 leading-relaxed">
              Stay ahead of road closures, metro line work, water maintenance, and ward notices delivered straight to your radar.
            </p>

            {/* Quick-commerce style 3-pill feature row */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-[11px] font-bold text-white">
              <div className="flex items-center gap-1.5">
                <Building2 size={13} className="text-[#D4FF00] shrink-0" />
                <span className="truncate">Ward Notices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass size={13} className="text-[#FA541C] shrink-0" />
                <span className="truncate">Traffic Shifts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#D4FF00] shrink-0" />
                <span className="truncate">Public Safety</span>
              </div>
            </div>
          </div>

          {/* Phone Form */}
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#FA541C]" />
                  <span>Enter Mobile Number</span>
                </span>
                <span className="text-[10px] text-black/60 font-medium">
                  Instant local setup • No OTP needed
                </span>
              </label>

              {/* Phone Input with visible +91 prefix */}
              <div className="flex items-center rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[0_4px_0_0_#121212] focus-within:ring-2 focus-within:ring-black">
                {/* Prefix Badge */}
                <div className="px-3.5 py-3 bg-[#FFF2E8] border-r-2 border-black flex items-center gap-1.5 shrink-0 select-none">
                  {/* Indian Flag Mini Stripe Indicator */}
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FA541C] inline-block" />
                  <span className="text-sm font-black font-mono text-black">+91</span>
                </div>

                {/* Number Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneNumber(val);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-3 text-base font-mono font-bold text-black focus:outline-none bg-transparent tracking-wider"
                  maxLength={10}
                />
              </div>

              {phoneError && (
                <div className="flex items-center gap-1.5 text-xs text-[#DC2626] font-bold mt-1.5">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}

              <p className="text-[11px] text-black/60 font-medium mt-1.5">
                Used solely to personalize your local citizen pass. No unsolicited messages or marketing calls.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-black/70 font-bold"
              >
                Skip for Now
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPhoneSubmitting}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="bg-black text-[#D4FF00] hover:bg-[#FA541C] hover:text-white font-black uppercase text-xs tracking-wider shadow-[0_4px_0_0_#121212]"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* SCREEN B: NAME AND PIN CODE WITH POSTAL LOOKUP */
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          {/* Top Back Nav Button & Verified Phone Pill */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setPhoneError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black hover:text-[#FA541C] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Change Number</span>
            </button>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FFF2E8] border border-black/20 text-black">
              <Phone size={10} className="text-[#FA541C]" />
              +91 {phoneNumber}
            </span>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1 flex items-center gap-1.5">
              <User size={13} className="text-[#FA541C]" />
              <span>Your Full Name</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. Aditya Sharma"
              required
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black shadow-[0_3px_0_0_#121212]"
            />
            {nameError && (
              <p className="text-xs text-[#DC2626] font-bold mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {nameError}
              </p>
            )}
          </div>

          {/* 6-Digit PIN Code Input */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass size={13} className="text-[#FA541C]" />
                <span>Postal PIN Code (6 Digits)</span>
              </span>
              {isLookingUpPin && (
                <span className="text-[11px] font-bold text-[#FA541C] flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  Resolving with India Post...
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={pinCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPinCode(val);
                  if (val.length === 6) {
                    handlePincodeLookup(val);
                  } else {
                    setPostalResult(null);
                    setPinError(null);
                  }
                }}
                placeholder="411001"
                maxLength={6}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-base font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black shadow-[0_3px_0_0_#121212] tracking-widest"
              />
              {postalResult && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </div>

            {pinError && (
              <p className="text-xs text-[#DC2626] font-bold mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {pinError}
              </p>
            )}
          </div>

          {/* READ-ONLY ADDRESS / LOCALITY PREVIEW PANEL (Light Gray Background) */}
          <div className="rounded-2xl border-2 border-black bg-[#F4F4F5] p-3.5 shadow-[0_3px_0_0_#121212] transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-black/60 flex items-center gap-1">
                <MapPin size={12} className="text-[#FA541C]" />
                Postal Area & Locality Preview
              </span>
              {postalResult && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4FF00] text-black border border-black">
                  VERIFIED AREA
                </span>
              )}
            </div>

            {postalResult ? (
              <div className="space-y-1.5">
                <div className="text-sm font-extrabold text-black flex items-center gap-1.5">
                  <span className="text-[#FA541C]">●</span>
                  <span>{postalResult.district}, {postalResult.state}</span>
                </div>

                {/* Multiple post offices selection if available */}
                {postalResult.postOffices.length > 1 ? (
                  <div>
                    <label className="text-[11px] font-bold text-black/70 block mb-1">
                      Select specific ward / post office:
                    </label>
                    <select
                      value={selectedPostOffice}
                      onChange={(e) => setSelectedPostOffice(e.target.value)}
                      className="w-full text-xs font-bold bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-black focus:outline-none"
                    >
                      {postalResult.postOffices.map((po) => (
                        <option key={po} value={po}>
                          {po} ({postalResult.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-black/80">
                    Locality: {postalResult.locality} ({postalResult.pincode})
                  </p>
                )}

                <p className="text-[10px] text-black/60 pt-0.5">
                  CivicRadar will tune alerts and feed dispatches for <strong>{postalResult.district}</strong>.
                </p>
              </div>
            ) : isLookingUpPin ? (
              <div className="py-2 text-center text-xs font-bold text-black/60 flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#FA541C]" />
                <span>Locating postal region from India Post directory...</span>
              </div>
            ) : (
              <p className="text-xs text-black/50 font-medium italic">
                Enter a 6-digit PIN code above to resolve your municipal post office and active district.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStep('phone');
              }}
              className="text-black/70 font-bold"
            >
              Back
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!postalResult || !name.trim()}
              icon={<Sparkles size={15} />}
              iconPosition="right"
              className="bg-black text-[#D4FF00] hover:bg-[#FA541C] hover:text-white font-black uppercase text-xs tracking-wider shadow-[0_4px_0_0_#121212]"
            >
              Finish Setup & Explore
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
