/**
 * CivicLens Location Dataset
 *
 * A curated, accurate dataset of major Indian cities, states, and notable localities.
 * Used for autocomplete suggestions in the location picker.
 *
 * Design choices:
 * - "searchTerms" includes alternate spellings, abbreviations, and common variations
 *   so partial matches like "deli", "blr", "mum", "hyd" resolve correctly.
 * - "locality" is the string passed to the SerpApi query (and stored in profile).
 * - "label" is the human-readable display name shown to the user.
 * - "type" is used for visual grouping and icons in the suggestion list.
 *
 * PIN code suggestions come from a separate PIN prefix lookup at runtime.
 */

export type LocationType = 'city' | 'district' | 'state' | 'locality';

export interface LocationSuggestion {
  id: string;
  label: string;           // Display name
  locality: string;        // Value passed to news query
  district?: string;
  state: string;
  type: LocationType;
  searchTerms: string[];   // Lower-cased alternates used for matching
}

export const LOCATION_DATASET: LocationSuggestion[] = [
  // ── Maharashtra ────────────────────────────────────────────────────────────
  {
    id: 'pune',
    label: 'Pune, Maharashtra',
    locality: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['pune', 'poona'],
  },
  {
    id: 'pune-shivajinagar',
    label: 'Shivajinagar, Pune',
    locality: 'Shivajinagar Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['shivajinagar', 'shivaji nagar', 'sn pune'],
  },
  {
    id: 'pune-kothrud',
    label: 'Kothrud, Pune',
    locality: 'Kothrud Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['kothrud', 'kothrud pune'],
  },
  {
    id: 'pune-hinjewadi',
    label: 'Hinjewadi, Pune',
    locality: 'Hinjewadi Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['hinjewadi', 'hinjawadi', 'it park pune'],
  },
  {
    id: 'pune-viman',
    label: 'Viman Nagar, Pune',
    locality: 'Viman Nagar Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['viman nagar', 'viman'],
  },
  {
    id: 'pune-hadapsar',
    label: 'Hadapsar, Pune',
    locality: 'Hadapsar Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['hadapsar', 'magarpatta'],
  },
  {
    id: 'pune-baner',
    label: 'Baner, Pune',
    locality: 'Baner Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['baner', 'balewadi'],
  },
  {
    id: 'pune-pimpri',
    label: 'Pimpri-Chinchwad, Pune',
    locality: 'Pimpri-Chinchwad',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['pimpri', 'chinchwad', 'pcmc', 'pimpri chinchwad'],
  },
  {
    id: 'pune-wakad',
    label: 'Wakad, Pune',
    locality: 'Wakad Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['wakad'],
  },
  {
    id: 'pune-aundh',
    label: 'Aundh, Pune',
    locality: 'Aundh Pune',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['aundh'],
  },
  {
    id: 'mumbai',
    label: 'Mumbai, Maharashtra',
    locality: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['mumbai', 'bombay', 'mum', 'bom'],
  },
  {
    id: 'mumbai-andheri',
    label: 'Andheri, Mumbai',
    locality: 'Andheri Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['andheri'],
  },
  {
    id: 'mumbai-bandra',
    label: 'Bandra, Mumbai',
    locality: 'Bandra Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    type: 'locality',
    searchTerms: ['bandra', 'band stand'],
  },
  {
    id: 'mumbai-thane',
    label: 'Thane, Maharashtra',
    locality: 'Thane',
    district: 'Thane',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['thane', 'thana'],
  },
  {
    id: 'nagpur',
    label: 'Nagpur, Maharashtra',
    locality: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['nagpur', 'orange city'],
  },
  {
    id: 'nashik',
    label: 'Nashik, Maharashtra',
    locality: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['nashik', 'nasik'],
  },
  {
    id: 'aurangabad',
    label: 'Aurangabad, Maharashtra',
    locality: 'Aurangabad',
    district: 'Aurangabad',
    state: 'Maharashtra',
    type: 'city',
    searchTerms: ['aurangabad', 'chhatrapati sambhajinagar'],
  },
  {
    id: 'maharashtra',
    label: 'Maharashtra (State)',
    locality: 'Maharashtra',
    state: 'Maharashtra',
    type: 'state',
    searchTerms: ['maharashtra', 'maha'],
  },

  // ── Delhi / NCR ────────────────────────────────────────────────────────────
  {
    id: 'delhi',
    label: 'Delhi',
    locality: 'Delhi',
    district: 'Delhi',
    state: 'Delhi',
    type: 'city',
    searchTerms: ['delhi', 'dilli', 'del', 'deli'],
  },
  {
    id: 'new-delhi',
    label: 'New Delhi',
    locality: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    type: 'city',
    searchTerms: ['new delhi', 'new dilli', 'ndmc', 'lutyens'],
  },
  {
    id: 'north-delhi',
    label: 'North Delhi',
    locality: 'North Delhi',
    district: 'North Delhi',
    state: 'Delhi',
    type: 'district',
    searchTerms: ['north delhi', 'chandni chowk', 'civil lines'],
  },
  {
    id: 'south-delhi',
    label: 'South Delhi',
    locality: 'South Delhi',
    district: 'South Delhi',
    state: 'Delhi',
    type: 'district',
    searchTerms: ['south delhi', 'saket', 'lajpat nagar', 'hauz khas'],
  },
  {
    id: 'west-delhi',
    label: 'West Delhi',
    locality: 'West Delhi',
    district: 'West Delhi',
    state: 'Delhi',
    type: 'district',
    searchTerms: ['west delhi', 'janakpuri', 'dwarka'],
  },
  {
    id: 'east-delhi',
    label: 'East Delhi',
    locality: 'East Delhi',
    district: 'East Delhi',
    state: 'Delhi',
    type: 'district',
    searchTerms: ['east delhi', 'preet vihar', 'laxmi nagar'],
  },
  {
    id: 'gurugram',
    label: 'Gurugram (Gurgaon), Haryana',
    locality: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    type: 'city',
    searchTerms: ['gurugram', 'gurgaon', 'cyber city'],
  },
  {
    id: 'noida',
    label: 'Noida, Uttar Pradesh',
    locality: 'Noida',
    district: 'Gautam Buddh Nagar',
    state: 'Uttar Pradesh',
    type: 'city',
    searchTerms: ['noida', 'greater noida'],
  },
  {
    id: 'faridabad',
    label: 'Faridabad, Haryana',
    locality: 'Faridabad',
    district: 'Faridabad',
    state: 'Haryana',
    type: 'city',
    searchTerms: ['faridabad'],
  },

  // ── Karnataka ──────────────────────────────────────────────────────────────
  {
    id: 'bengaluru',
    label: 'Bengaluru, Karnataka',
    locality: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    type: 'city',
    searchTerms: ['bengaluru', 'bangalore', 'blr', 'bang'],
  },
  {
    id: 'bengaluru-koramangala',
    label: 'Koramangala, Bengaluru',
    locality: 'Koramangala Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    type: 'locality',
    searchTerms: ['koramangala', 'kormangala'],
  },
  {
    id: 'bengaluru-whitefield',
    label: 'Whitefield, Bengaluru',
    locality: 'Whitefield Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    type: 'locality',
    searchTerms: ['whitefield', 'it corridor bangalore'],
  },
  {
    id: 'bengaluru-indiranagar',
    label: 'Indiranagar, Bengaluru',
    locality: 'Indiranagar Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    type: 'locality',
    searchTerms: ['indiranagar'],
  },
  {
    id: 'mysuru',
    label: 'Mysuru, Karnataka',
    locality: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    type: 'city',
    searchTerms: ['mysuru', 'mysore'],
  },
  {
    id: 'karnataka',
    label: 'Karnataka (State)',
    locality: 'Karnataka',
    state: 'Karnataka',
    type: 'state',
    searchTerms: ['karnataka', 'ktka'],
  },

  // ── Tamil Nadu ─────────────────────────────────────────────────────────────
  {
    id: 'chennai',
    label: 'Chennai, Tamil Nadu',
    locality: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    type: 'city',
    searchTerms: ['chennai', 'madras', 'maa'],
  },
  {
    id: 'chennai-t-nagar',
    label: 'T. Nagar, Chennai',
    locality: 'T Nagar Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    type: 'locality',
    searchTerms: ['t nagar', 'thyagaraya nagar'],
  },
  {
    id: 'coimbatore',
    label: 'Coimbatore, Tamil Nadu',
    locality: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    type: 'city',
    searchTerms: ['coimbatore', 'kovai'],
  },
  {
    id: 'madurai',
    label: 'Madurai, Tamil Nadu',
    locality: 'Madurai',
    district: 'Madurai',
    state: 'Tamil Nadu',
    type: 'city',
    searchTerms: ['madurai'],
  },
  {
    id: 'tamil-nadu',
    label: 'Tamil Nadu (State)',
    locality: 'Tamil Nadu',
    state: 'Tamil Nadu',
    type: 'state',
    searchTerms: ['tamil nadu', 'tn'],
  },

  // ── Telangana ──────────────────────────────────────────────────────────────
  {
    id: 'hyderabad',
    label: 'Hyderabad, Telangana',
    locality: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    type: 'city',
    searchTerms: ['hyderabad', 'hyd', 'cyberabad'],
  },
  {
    id: 'hyderabad-hitec',
    label: 'HITEC City, Hyderabad',
    locality: 'HITEC City Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    type: 'locality',
    searchTerms: ['hitec city', 'hi tech city', 'madhapur'],
  },
  {
    id: 'secunderabad',
    label: 'Secunderabad, Telangana',
    locality: 'Secunderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    type: 'city',
    searchTerms: ['secunderabad', 'secundrabad'],
  },
  {
    id: 'telangana',
    label: 'Telangana (State)',
    locality: 'Telangana',
    state: 'Telangana',
    type: 'state',
    searchTerms: ['telangana', 'ts'],
  },

  // ── Gujarat ────────────────────────────────────────────────────────────────
  {
    id: 'ahmedabad',
    label: 'Ahmedabad, Gujarat',
    locality: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    type: 'city',
    searchTerms: ['ahmedabad', 'amdavad', 'amd'],
  },
  {
    id: 'surat',
    label: 'Surat, Gujarat',
    locality: 'Surat',
    district: 'Surat',
    state: 'Gujarat',
    type: 'city',
    searchTerms: ['surat', 'diamond city'],
  },
  {
    id: 'vadodara',
    label: 'Vadodara, Gujarat',
    locality: 'Vadodara',
    district: 'Vadodara',
    state: 'Gujarat',
    type: 'city',
    searchTerms: ['vadodara', 'baroda'],
  },
  {
    id: 'gujarat',
    label: 'Gujarat (State)',
    locality: 'Gujarat',
    state: 'Gujarat',
    type: 'state',
    searchTerms: ['gujarat', 'guj'],
  },

  // ── Rajasthan ──────────────────────────────────────────────────────────────
  {
    id: 'jaipur',
    label: 'Jaipur, Rajasthan',
    locality: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    type: 'city',
    searchTerms: ['jaipur', 'pink city', 'jai'],
  },
  {
    id: 'jodhpur',
    label: 'Jodhpur, Rajasthan',
    locality: 'Jodhpur',
    district: 'Jodhpur',
    state: 'Rajasthan',
    type: 'city',
    searchTerms: ['jodhpur', 'blue city'],
  },
  {
    id: 'rajasthan',
    label: 'Rajasthan (State)',
    locality: 'Rajasthan',
    state: 'Rajasthan',
    type: 'state',
    searchTerms: ['rajasthan', 'raj'],
  },

  // ── Uttar Pradesh ─────────────────────────────────────────────────────────
  {
    id: 'lucknow',
    label: 'Lucknow, Uttar Pradesh',
    locality: 'Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    type: 'city',
    searchTerms: ['lucknow', 'lko', 'nawabi'],
  },
  {
    id: 'kanpur',
    label: 'Kanpur, Uttar Pradesh',
    locality: 'Kanpur',
    district: 'Kanpur',
    state: 'Uttar Pradesh',
    type: 'city',
    searchTerms: ['kanpur', 'cawnpore'],
  },
  {
    id: 'varanasi',
    label: 'Varanasi, Uttar Pradesh',
    locality: 'Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    type: 'city',
    searchTerms: ['varanasi', 'banaras', 'kashi'],
  },
  {
    id: 'agra',
    label: 'Agra, Uttar Pradesh',
    locality: 'Agra',
    district: 'Agra',
    state: 'Uttar Pradesh',
    type: 'city',
    searchTerms: ['agra', 'taj mahal'],
  },
  {
    id: 'uttar-pradesh',
    label: 'Uttar Pradesh (State)',
    locality: 'Uttar Pradesh',
    state: 'Uttar Pradesh',
    type: 'state',
    searchTerms: ['uttar pradesh', 'up'],
  },

  // ── West Bengal ────────────────────────────────────────────────────────────
  {
    id: 'kolkata',
    label: 'Kolkata, West Bengal',
    locality: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    type: 'city',
    searchTerms: ['kolkata', 'calcutta', 'cal', 'kol'],
  },
  {
    id: 'kolkata-salt-lake',
    label: 'Salt Lake City, Kolkata',
    locality: 'Salt Lake Kolkata',
    district: 'North 24 Parganas',
    state: 'West Bengal',
    type: 'locality',
    searchTerms: ['salt lake', 'bidhannagar', 'sector v kolkata'],
  },
  {
    id: 'west-bengal',
    label: 'West Bengal (State)',
    locality: 'West Bengal',
    state: 'West Bengal',
    type: 'state',
    searchTerms: ['west bengal', 'wb', 'bengal'],
  },

  // ── Kerala ─────────────────────────────────────────────────────────────────
  {
    id: 'thiruvananthapuram',
    label: 'Thiruvananthapuram, Kerala',
    locality: 'Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    type: 'city',
    searchTerms: ['thiruvananthapuram', 'trivandrum', 'tvm'],
  },
  {
    id: 'kochi',
    label: 'Kochi, Kerala',
    locality: 'Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    type: 'city',
    searchTerms: ['kochi', 'cochin', 'ernakulam'],
  },
  {
    id: 'kozhikode',
    label: 'Kozhikode, Kerala',
    locality: 'Kozhikode',
    district: 'Kozhikode',
    state: 'Kerala',
    type: 'city',
    searchTerms: ['kozhikode', 'calicut'],
  },
  {
    id: 'kerala',
    label: 'Kerala (State)',
    locality: 'Kerala',
    state: 'Kerala',
    type: 'state',
    searchTerms: ['kerala', 'gods own country'],
  },

  // ── Punjab ─────────────────────────────────────────────────────────────────
  {
    id: 'chandigarh',
    label: 'Chandigarh (UT)',
    locality: 'Chandigarh',
    district: 'Chandigarh',
    state: 'Chandigarh',
    type: 'city',
    searchTerms: ['chandigarh', 'chd', 'the city beautiful'],
  },
  {
    id: 'amritsar',
    label: 'Amritsar, Punjab',
    locality: 'Amritsar',
    district: 'Amritsar',
    state: 'Punjab',
    type: 'city',
    searchTerms: ['amritsar', 'golden city'],
  },
  {
    id: 'ludhiana',
    label: 'Ludhiana, Punjab',
    locality: 'Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    type: 'city',
    searchTerms: ['ludhiana'],
  },
  {
    id: 'punjab',
    label: 'Punjab (State)',
    locality: 'Punjab',
    state: 'Punjab',
    type: 'state',
    searchTerms: ['punjab', 'pb'],
  },

  // ── Madhya Pradesh ────────────────────────────────────────────────────────
  {
    id: 'bhopal',
    label: 'Bhopal, Madhya Pradesh',
    locality: 'Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    type: 'city',
    searchTerms: ['bhopal', 'bpl', 'city of lakes'],
  },
  {
    id: 'indore',
    label: 'Indore, Madhya Pradesh',
    locality: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    type: 'city',
    searchTerms: ['indore', 'mini mumbai'],
  },
  {
    id: 'madhya-pradesh',
    label: 'Madhya Pradesh (State)',
    locality: 'Madhya Pradesh',
    state: 'Madhya Pradesh',
    type: 'state',
    searchTerms: ['madhya pradesh', 'mp'],
  },

  // ── Haryana ────────────────────────────────────────────────────────────────
  {
    id: 'haryana',
    label: 'Haryana (State)',
    locality: 'Haryana',
    state: 'Haryana',
    type: 'state',
    searchTerms: ['haryana', 'hr'],
  },

  // ── Other States ───────────────────────────────────────────────────────────
  {
    id: 'goa',
    label: 'Goa',
    locality: 'Goa',
    district: 'North Goa',
    state: 'Goa',
    type: 'state',
    searchTerms: ['goa', 'panaji', 'panjim'],
  },
  {
    id: 'bhubaneswar',
    label: 'Bhubaneswar, Odisha',
    locality: 'Bhubaneswar',
    district: 'Khurda',
    state: 'Odisha',
    type: 'city',
    searchTerms: ['bhubaneswar', 'bbsr', 'odisha', 'orissa'],
  },
  {
    id: 'patna',
    label: 'Patna, Bihar',
    locality: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    type: 'city',
    searchTerms: ['patna', 'bihar', 'bih'],
  },
  {
    id: 'raipur',
    label: 'Raipur, Chhattisgarh',
    locality: 'Raipur',
    district: 'Raipur',
    state: 'Chhattisgarh',
    type: 'city',
    searchTerms: ['raipur', 'chhattisgarh', 'cg'],
  },
  {
    id: 'ranchi',
    label: 'Ranchi, Jharkhand',
    locality: 'Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    type: 'city',
    searchTerms: ['ranchi', 'jharkhand'],
  },
  {
    id: 'dehradun',
    label: 'Dehradun, Uttarakhand',
    locality: 'Dehradun',
    district: 'Dehradun',
    state: 'Uttarakhand',
    type: 'city',
    searchTerms: ['dehradun', 'doon', 'uttarakhand', 'uk'],
  },
  {
    id: 'shimla',
    label: 'Shimla, Himachal Pradesh',
    locality: 'Shimla',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    type: 'city',
    searchTerms: ['shimla', 'simla', 'himachal', 'hp'],
  },
  {
    id: 'srinagar',
    label: 'Srinagar, J&K',
    locality: 'Srinagar',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    type: 'city',
    searchTerms: ['srinagar', 'kashmir', 'jammu kashmir', 'jk'],
  },
  {
    id: 'jammu',
    label: 'Jammu, J&K',
    locality: 'Jammu',
    district: 'Jammu',
    state: 'Jammu & Kashmir',
    type: 'city',
    searchTerms: ['jammu'],
  },
  {
    id: 'guwahati',
    label: 'Guwahati, Assam',
    locality: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    type: 'city',
    searchTerms: ['guwahati', 'gauhati', 'assam'],
  },
  {
    id: 'imphal',
    label: 'Imphal, Manipur',
    locality: 'Imphal',
    district: 'Imphal West',
    state: 'Manipur',
    type: 'city',
    searchTerms: ['imphal', 'manipur'],
  },
  {
    id: 'aizawl',
    label: 'Aizawl, Mizoram',
    locality: 'Aizawl',
    district: 'Aizawl',
    state: 'Mizoram',
    type: 'city',
    searchTerms: ['aizawl', 'mizoram'],
  },
  {
    id: 'panaji',
    label: 'Panaji, Goa',
    locality: 'Panaji',
    district: 'North Goa',
    state: 'Goa',
    type: 'city',
    searchTerms: ['panaji', 'panjim', 'north goa'],
  },
  {
    id: 'visakhapatnam',
    label: 'Visakhapatnam, Andhra Pradesh',
    locality: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    type: 'city',
    searchTerms: ['visakhapatnam', 'vizag', 'waltair', 'andhra pradesh', 'ap'],
  },
  {
    id: 'vijayawada',
    label: 'Vijayawada, Andhra Pradesh',
    locality: 'Vijayawada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    type: 'city',
    searchTerms: ['vijayawada', 'bezawada'],
  },
  {
    id: 'andhra-pradesh',
    label: 'Andhra Pradesh (State)',
    locality: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    type: 'state',
    searchTerms: ['andhra pradesh', 'ap'],
  },
];

/**
 * Search the dataset for matches against a user query.
 * Returns up to `limit` sorted results. City/locality matches rank above state matches.
 */
export function searchLocations(query: string, limit = 8): LocationSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const scored: Array<{ suggestion: LocationSuggestion; score: number }> = [];

  for (const s of LOCATION_DATASET) {
    let score = 0;

    // Label prefix match (strongest signal)
    if (s.label.toLowerCase().startsWith(q)) score += 100;
    else if (s.label.toLowerCase().includes(q)) score += 60;

    // Locality exact/prefix match
    if (s.locality.toLowerCase().startsWith(q)) score += 80;
    else if (s.locality.toLowerCase().includes(q)) score += 40;

    // Search terms
    for (const term of s.searchTerms) {
      if (term === q) { score += 90; break; }
      if (term.startsWith(q)) { score += 70; break; }
      if (term.includes(q)) { score += 30; break; }
    }

    if (score === 0) continue;

    // Boost cities/localities over states in ranking
    if (s.type === 'city') score += 15;
    if (s.type === 'locality') score += 10;

    scored.push({ suggestion: s, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.suggestion);
}
