export interface PostalLocationResult {
  pincode: string;
  locality: string;
  district: string;
  state: string;
  postOffices: string[];
  formattedAddress: string;
}

// Built-in verified offline fallback data for instant response and offline resilience
const VERIFIED_PIN_FALLBACKS: Record<string, Omit<PostalLocationResult, 'pincode'>> = {
  '411001': {
    locality: 'Pune City',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Pune City H.O', 'Shivajinagar', 'Rasta Peth'],
    formattedAddress: 'Pune City, Pune, Maharashtra',
  },
  '411002': {
    locality: 'Bajirao Road',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Bajirao Road S.O', 'Budhwar Peth'],
    formattedAddress: 'Bajirao Road, Pune, Maharashtra',
  },
  '411004': {
    locality: 'Deccan Gymkhana',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Deccan Gymkhana S.O', 'Erandwana', 'Fergusson College'],
    formattedAddress: 'Deccan Gymkhana, Pune, Maharashtra',
  },
  '411014': {
    locality: 'Viman Nagar',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Vadgaon Sheri S.O', 'Viman Nagar', 'Kalyani Nagar'],
    formattedAddress: 'Viman Nagar, Pune, Maharashtra',
  },
  '411028': {
    locality: 'Hadapsar',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Hadapsar S.O', 'Magarpatta City', 'Saswad Road'],
    formattedAddress: 'Hadapsar, Pune, Maharashtra',
  },
  '411038': {
    locality: 'Kothrud',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Kothrud S.O', 'Karve Nagar', 'Dahanukar Colony'],
    formattedAddress: 'Kothrud, Pune, Maharashtra',
  },
  '411057': {
    locality: 'Hinjewadi',
    district: 'Pune',
    state: 'Maharashtra',
    postOffices: ['Hinjewadi S.O', 'Maan', 'Wakad'],
    formattedAddress: 'Hinjewadi, Pune, Maharashtra',
  },
  '400001': {
    locality: 'Fort',
    district: 'Mumbai',
    state: 'Maharashtra',
    postOffices: ['Mumbai G.P.O.', 'Fort Market S.O'],
    formattedAddress: 'Fort, Mumbai, Maharashtra',
  },
  '110001': {
    locality: 'Connaught Place',
    district: 'Central Delhi',
    state: 'Delhi',
    postOffices: ['New Delhi G.P.O.', 'Connaught Place S.O', 'Baroda House'],
    formattedAddress: 'Connaught Place, Central Delhi, Delhi',
  },
  '560001': {
    locality: 'Bengaluru G.P.O.',
    district: 'Bengaluru',
    state: 'Karnataka',
    postOffices: ['Bengaluru G.P.O.', 'Cubbon Road', 'Vidhana Soudha'],
    formattedAddress: 'Bengaluru G.P.O., Bengaluru, Karnataka',
  },
};

class PostalService {
  private cache = new Map<string, PostalLocationResult>();

  /**
   * Validates if a string is a 6-digit Indian Postal PIN code
   */
  isValidPinCode(pincode: string): boolean {
    const cleaned = pincode.trim();
    return /^[1-9][0-9]{5}$/.test(cleaned);
  }

  /**
   * Resolves a 6-digit PIN code to its corresponding post office, district, and state.
   * Handles caching, offline fallbacks, and the public postal PIN code API.
   */
  async lookupPincode(pincode: string): Promise<PostalLocationResult> {
    const cleaned = pincode.trim();

    if (!this.isValidPinCode(cleaned)) {
      throw new Error('Please enter a valid 6-digit Indian PIN code (e.g. 411001).');
    }

    // 1. Check in-memory cache
    if (this.cache.has(cleaned)) {
      return this.cache.get(cleaned)!;
    }

    // 2. Query public India Post PIN code API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Postal service returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data[0]) {
        const item = data[0];
        if (item.Status === 'Success' && Array.isArray(item.PostOffice) && item.PostOffice.length > 0) {
          const postOfficesList: string[] = item.PostOffice
            .map((po: { Name?: string }) => po.Name?.trim() || '')
            .filter((name: string) => name.length > 0);

          const firstPo = item.PostOffice[0];
          const district = firstPo.District?.trim() || '';
          const state = firstPo.State?.trim() || '';
          const locality = firstPo.Name?.trim() || district || 'Local Area';

          const formattedAddress = [locality, district, state]
            .filter((part) => part && part !== district || part === locality)
            .join(', ');

          const result: PostalLocationResult = {
            pincode: cleaned,
            locality: district || locality, // locality used for CivicRadar news matching
            district,
            state,
            postOffices: Array.from(new Set(postOfficesList)),
            formattedAddress,
          };

          this.cache.set(cleaned, result);
          return result;
        } else if (item.Status === 'Error') {
          throw new Error('No post office records found for this PIN code. Please verify the code.');
        }
      }
    } catch (err: unknown) {
      // 3. Fallback to built-in verified records if available (especially offline or sandbox)
      if (VERIFIED_PIN_FALLBACKS[cleaned]) {
        const fallback = VERIFIED_PIN_FALLBACKS[cleaned];
        const result: PostalLocationResult = {
          pincode: cleaned,
          ...fallback,
        };
        this.cache.set(cleaned, result);
        return result;
      }

      // If not in verified fallback and fetch failed with a known error message, throw friendly error
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('valid 6-digit') || errorMsg.includes('No post office records')) {
        throw err;
      }

      throw new Error('Unable to verify PIN code online. Please check network connection or verify the 6-digit code.');
    }

    throw new Error('No post office records found for this PIN code.');
  }
}

export const postalService = new PostalService();
