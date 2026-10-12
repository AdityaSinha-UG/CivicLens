/**
 * LocationPickerModal
 *
 * Unified single-input location picker. Accepts:
 *   - City names (e.g. "Pune", "Mumbai", "Bangalore")
 *   - State names (e.g. "Maharashtra", "Delhi")
 *   - Sub-locality names (e.g. "Koramangala", "Baner")
 *   - Indian PIN codes (6 digits; resolved via postalpincode.in + offline fallbacks)
 *
 * Features:
 *   - Autocomplete suggestions from the built-in LOCATION_DATASET
 *   - Real-time PIN code lookup with offline fallback
 *   - Keyboard navigation (↑/↓/Enter/Escape)
 *   - Debounced input to prevent excessive PIN lookups
 *   - Clear error display for invalid PINs / not-found locations
 *   - Dark mode support throughout
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Building2, Landmark, Map, X, Loader2, Check, ChevronRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { type LocationSuggestion, searchLocations } from '../../data/locationData';
import { postalService } from '../../services/postalService';

interface LocationPickerModalProps {
  isOpen: boolean;
  currentLocality: string;
  onClose: () => void;
  onSelectLocality: (locality: string) => void;
}

type SuggestionSource = 'dataset' | 'pin';

interface DisplaySuggestion {
  id: string;
  label: string;
  locality: string;
  sublabel: string;
  type: LocationSuggestion['type'] | 'pin';
  source: SuggestionSource;
}

const PIN_REGEX = /^[1-9][0-9]{0,5}$/;
const FULL_PIN_REGEX = /^[1-9][0-9]{5}$/;

function typeIcon(type: DisplaySuggestion['type']) {
  switch (type) {
    case 'state': return <Map size={14} className="shrink-0 text-purple-500 dark:text-purple-400" />;
    case 'city': return <Building2 size={14} className="shrink-0 text-[#FA541C]" />;
    case 'district': return <Landmark size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />;
    case 'pin': return <MapPin size={14} className="shrink-0 text-green-600 dark:text-green-400" />;
    default: return <MapPin size={14} className="shrink-0 text-[#FA541C]" />;
  }
}

function typeLabel(type: DisplaySuggestion['type']): string {
  switch (type) {
    case 'state': return 'State';
    case 'city': return 'City';
    case 'district': return 'District';
    case 'locality': return 'Locality';
    case 'pin': return 'PIN Code';
  }
}

// Popular quick-picks shown before the user starts typing
const QUICK_PICKS: Array<{ locality: string; label: string; emoji: string }> = [
  { locality: 'Pune', label: 'Pune', emoji: '🏛️' },
  { locality: 'Mumbai', label: 'Mumbai', emoji: '🌊' },
  { locality: 'Delhi', label: 'Delhi', emoji: '🏛️' },
  { locality: 'Bengaluru', label: 'Bengaluru', emoji: '🌿' },
  { locality: 'Hyderabad', label: 'Hyderabad', emoji: '💎' },
  { locality: 'Chennai', label: 'Chennai', emoji: '🌡️' },
  { locality: 'Kolkata', label: 'Kolkata', emoji: '🎭' },
  { locality: 'Ahmedabad', label: 'Ahmedabad', emoji: '🪁' },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  currentLocality,
  onClose,
  onSelectLocality,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DisplaySuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [confirmedLocality, setConfirmedLocality] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pinDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPinQueried = useRef<string>('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSuggestions([]);
      setActiveIndex(-1);
      setPinError(null);
      setConfirmedLocality(null);
      setIsPinLoading(false);
      // Small delay to let modal animate in
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const buildDatasetSuggestions = useCallback((q: string): DisplaySuggestion[] => {
    return searchLocations(q, 7).map((s) => ({
      id: s.id,
      label: s.label,
      locality: s.locality,
      sublabel: `${typeLabel(s.type)} · ${s.state}`,
      type: s.type,
      source: 'dataset' as const,
    }));
  }, []);

  const lookupPin = useCallback(async (pin: string) => {
    if (pin === lastPinQueried.current) return;
    lastPinQueried.current = pin;
    setIsPinLoading(true);
    setPinError(null);
    setSuggestions([]);
    try {
      const result = await postalService.lookupPincode(pin);
      setSuggestions([{
        id: `pin-${pin}`,
        label: `${pin} — ${result.district}, ${result.state}`,
        locality: result.district || result.locality,
        sublabel: `PIN Code · ${result.state}`,
        type: 'pin',
        source: 'pin',
      }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PIN code not found.';
      setPinError(msg);
      setSuggestions([]);
    } finally {
      setIsPinLoading(false);
    }
  }, []);

  // Compute suggestions on every keystroke
  useEffect(() => {
    const q = query.trim();
    setActiveIndex(-1);
    setPinError(null);
    setConfirmedLocality(null);

    if (!q) {
      setSuggestions([]);
      setIsPinLoading(false);
      if (pinDebounce.current) clearTimeout(pinDebounce.current);
      return;
    }

    // PIN mode: only digits, starts with 1-9
    if (PIN_REGEX.test(q)) {
      setSuggestions([]);
      if (pinDebounce.current) clearTimeout(pinDebounce.current);

      if (FULL_PIN_REGEX.test(q)) {
        // Full 6-digit PIN: debounce 400ms then lookup
        pinDebounce.current = setTimeout(() => lookupPin(q), 400);
      } else {
        // Partial PIN: show hint
        setIsPinLoading(false);
        setSuggestions([{
          id: 'pin-hint',
          label: `Enter full 6-digit PIN code`,
          locality: '',
          sublabel: `${6 - q.length} more digit${6 - q.length !== 1 ? 's' : ''} needed`,
          type: 'pin',
          source: 'pin',
        }]);
      }
      return;
    }

    // Text mode: dataset search
    if (pinDebounce.current) clearTimeout(pinDebounce.current);
    setIsPinLoading(false);
    const results = buildDatasetSuggestions(q);
    setSuggestions(results);
  }, [query, buildDatasetSuggestions, lookupPin]);

  const handleSelect = useCallback((s: DisplaySuggestion) => {
    if (!s.locality || s.id === 'pin-hint') return;
    setConfirmedLocality(s.locality);
    onSelectLocality(s.locality);
    onClose();
  }, [onSelectLocality, onClose]);

  const handleQuickPick = (locality: string) => {
    onSelectLocality(locality);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const selectable = suggestions.filter((s) => s.locality && s.id !== 'pin-hint');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, selectable.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && selectable[activeIndex]) {
        handleSelect(selectable[activeIndex]);
      } else if (selectable.length === 1) {
        handleSelect(selectable[0]);
      }
    } else if (e.key === 'Escape') {
      if (query) setQuery('');
      else onClose();
    }
  };

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const isTypingPin = query.trim().length > 0 && PIN_REGEX.test(query.trim());
  const isFullPin = FULL_PIN_REGEX.test(query.trim());
  const selectableSuggestions = suggestions.filter((s) => s.locality && s.id !== 'pin-hint');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Location"
      subtitle="City · State · Locality · PIN code — all in one box"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* ── Search Input ─────────────────────────────────────────────────── */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            {isPinLoading
              ? <Loader2 size={18} className="text-[#FA541C] animate-spin" />
              : <Search size={18} className="text-black/40 dark:text-[#F5EEE6]/40" />
            }
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, state, locality or PIN code…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Location search"
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            aria-activedescendant={activeIndex >= 0 ? `loc-suggestion-${activeIndex}` : undefined}
            className="w-full pl-10 pr-9 py-3 rounded-2xl border-2 border-black dark:border-[#5A3A1A] bg-white dark:bg-[#2A1E10] text-sm font-bold text-black dark:text-[#F5EEE6] placeholder:text-black/30 dark:placeholder:text-[#F5EEE6]/30 focus:outline-none focus:ring-2 focus:ring-[#FA541C] focus:border-[#FA541C] transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); setPinError(null); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-black/40 dark:text-[#F5EEE6]/40 hover:text-black dark:hover:text-[#F5EEE6] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Typing hint for PIN ───────────────────────────────────────────── */}
        {isTypingPin && !isFullPin && (
          <p className="text-xs text-black/50 dark:text-[#F5EEE6]/50 font-medium flex items-center gap-1.5">
            <MapPin size={12} className="text-[#FA541C]" />
            Continue typing your 6-digit PIN code…
          </p>
        )}

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {pinError && (
          <div className="flex items-start gap-2 p-3 bg-[#FEE2E2] dark:bg-[#3D1414] border-2 border-[#DC2626] rounded-2xl text-xs text-[#7F1D1D] dark:text-[#FCA5A5] font-medium">
            <X size={14} className="text-[#DC2626] shrink-0 mt-0.5" />
            {pinError}
          </div>
        )}

        {/* ── Suggestions list ──────────────────────────────────────────────── */}
        {suggestions.length > 0 && (
          <div>
            <span className="text-[10px] font-black text-black/50 dark:text-[#F5EEE6]/50 uppercase tracking-widest mb-2 block">
              {isTypingPin ? 'PIN Lookup' : 'Suggestions'}
            </span>
            <ul
              ref={listRef}
              id="location-suggestions"
              role="listbox"
              aria-label="Location suggestions"
              className="space-y-1 max-h-60 overflow-y-auto"
            >
              {suggestions.map((s, i) => {
                const isSelectable = !!s.locality && s.id !== 'pin-hint';
                const isActive = selectableSuggestions.indexOf(s) === activeIndex;
                const isCurrentLocality = s.locality.toLowerCase() === currentLocality.toLowerCase();

                return (
                  <li
                    key={s.id}
                    id={`loc-suggestion-${i}`}
                    role={isSelectable ? 'option' : 'presentation'}
                    aria-selected={isActive}
                    onClick={() => isSelectable && handleSelect(s)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all text-sm ${
                      isSelectable ? 'cursor-pointer' : 'cursor-default opacity-60'
                    } ${
                      isActive
                        ? 'bg-[#FA541C] text-white'
                        : isCurrentLocality
                        ? 'bg-black dark:bg-[#FA541C]/20 text-[#FA541C] dark:text-[#FA541C] border-2 border-[#FA541C]/50'
                        : isSelectable
                        ? 'bg-white dark:bg-[#231A0F] text-black dark:text-[#F5EEE6] border-2 border-black/10 dark:border-[#5A3A1A] hover:border-[#FA541C] hover:bg-[#FFF2E8] dark:hover:bg-[#2E1F0D]'
                        : 'bg-white dark:bg-[#231A0F] text-black/50 dark:text-[#F5EEE6]/50 border-2 border-dashed border-black/10 dark:border-[#5A3A1A]/50'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : ''}>
                      {typeIcon(s.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate leading-tight">{s.label}</p>
                      <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-black/50 dark:text-[#F5EEE6]/50'}`}>
                        {s.sublabel}
                      </p>
                    </div>
                    {isCurrentLocality && !isActive && (
                      <Check size={14} className="text-[#FA541C] shrink-0" />
                    )}
                    {isSelectable && !isCurrentLocality && (
                      <ChevronRight size={14} className={`shrink-0 ${isActive ? 'text-white/70' : 'text-black/20 dark:text-[#F5EEE6]/20'}`} />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── No results for text query ──────────────────────────────────────── */}
        {query.trim().length >= 2 && !isTypingPin && !isFullPin && suggestions.length === 0 && !isPinLoading && (
          <div className="text-center py-4">
            <p className="text-xs font-bold text-black/50 dark:text-[#F5EEE6]/50">
              No matching locations found for "{query}"
            </p>
            <p className="text-xs text-black/40 dark:text-[#F5EEE6]/40 mt-1">
              Try a different spelling, or enter a 6-digit PIN code.
            </p>
          </div>
        )}

        {/* ── Keyboard hint ────────────────────────────────────────────────── */}
        {selectableSuggestions.length > 1 && (
          <p className="text-[10px] text-black/30 dark:text-[#F5EEE6]/30 font-medium text-center">
            ↑ ↓ to navigate · Enter to select · Esc to clear
          </p>
        )}

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        {!query && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-black/10 dark:bg-[#5A3A1A]/50" />
              <span className="text-[10px] font-black text-black/40 dark:text-[#F5EEE6]/40 uppercase tracking-widest">
                Popular Cities
              </span>
              <div className="flex-1 h-px bg-black/10 dark:bg-[#5A3A1A]/50" />
            </div>

            {/* ── Quick picks ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-2">
              {QUICK_PICKS.map((qp) => {
                const isActive = qp.locality.toLowerCase() === currentLocality.toLowerCase();
                return (
                  <button
                    key={qp.locality}
                    type="button"
                    onClick={() => handleQuickPick(qp.locality)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black dark:bg-[#FA541C] text-[#D4FF00] dark:text-black border-black dark:border-[#FA541C] shadow-[0_3px_0_0_#FA541C] dark:shadow-[0_3px_0_0_#121212]'
                        : 'bg-white dark:bg-[#231A0F] text-black dark:text-[#F5EEE6] border-black/15 dark:border-[#5A3A1A] hover:border-[#FA541C] hover:bg-[#FFF2E8] dark:hover:bg-[#2E1F0D] hover:shadow-[0_2px_0_0_#FA541C]'
                    }`}
                  >
                    <span className="text-base leading-none">{qp.emoji}</span>
                    <span className="leading-tight text-center truncate w-full">{qp.label}</span>
                    {isActive && <Check size={10} className="shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Active location notice */}
            <div className="flex items-center gap-2 p-3 bg-[#FFF2E8] dark:bg-[#231A0F] border-2 border-[#FA541C]/30 rounded-2xl">
              <MapPin size={14} className="text-[#FA541C] shrink-0" />
              <p className="text-xs font-bold text-black dark:text-[#F5EEE6]">
                Currently showing news for{' '}
                <span className="text-[#FA541C] underline decoration-2 underline-offset-2">
                  {currentLocality}
                </span>
              </p>
            </div>
          </>
        )}

        {/* Confirmed state (brief feedback after selection) */}
        {confirmedLocality && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border-2 border-green-500/40 rounded-2xl">
            <Check size={14} className="text-green-600 shrink-0" />
            <p className="text-xs font-bold text-green-800 dark:text-green-300">
              Location set to {confirmedLocality}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
