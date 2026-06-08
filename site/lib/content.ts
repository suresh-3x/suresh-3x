/**
 * Single source of truth for all site copy and project specs.
 * Edit values here rather than hardcoding strings in components.
 *
 * NOTE: Commercial/legal figures (price, carpet area, RERA no., possession date)
 * are intentionally placeholders. Confirm with Mayfair Housing before go-live.
 */

export const site = {
  name: "Codename CORAL",
  developer: "Mayfair Housing",
  tagline: "Live in the reef of calm.",
  subtagline:
    "Mira Road's first tropical-themed luxury residences — a sanctuary of light, water and breathable architecture.",
  url: "https://codenamecoral.com",
  // TODO: confirm official contact details before go-live
  phone: "+91 00000 00000",
  email: "sales@codenamecoral.com",
  rera: "{{RERA_NO}}", // TODO: confirm MahaRERA registration number
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Residences", href: "#residences" },
  { label: "Amenities", href: "#amenities" },
  { label: "The Tower", href: "#tower" },
  { label: "Location", href: "#location" },
  { label: "Gallery", href: "#gallery" },
];

export const story = {
  eyebrow: "The Concept",
  title: "Inspired by the slow, layered formation of coral.",
  body: [
    "Coral does not rush. It builds — patiently, beautifully — layer upon layer, until an entire ecosystem of life takes shape. Codename CORAL borrows that philosophy and shapes a tropical sanctuary within Mumbai.",
    "Light pours through breathable architecture. Greenery softens every edge. Water moves quietly through resort-inspired landscapes. The result is a home that feels less like a tower and more like a calm, living reef above the city.",
  ],
  pillars: [
    { title: "Light", text: "Breathable, sun-washed architecture that opens to the sky." },
    { title: "Water", text: "Resort-inspired waterscapes that cool and calm the senses." },
    { title: "Greenery", text: "Layered tropical landscaping woven through the podium decks." },
    { title: "Calm", text: "A refined, slow-living environment in the heart of the suburb." },
  ],
};

export type Residence = {
  type: string;
  name: string;
  description: string;
  highlights: string[];
  carpet: string; // placeholder
  price: string; // placeholder
  /**
   * INTERIM royalty-free stock image (Unsplash License). Local copy in /public.
   * TODO: replace with real Mayfair Housing residence renders before go-live.
   */
  image: string;
  tone: string; // gradient fallback behind the image
};

export const residences: Residence[] = [
  {
    type: "2 BHK",
    name: "2 Bed Deck Residence",
    description:
      "Light-filled two-bedroom homes with a signature private deck — an outdoor room that blurs the line between living space and tropical garden.",
    highlights: ["Private sun deck", "Cross-ventilated layout", "Premium fittings"],
    carpet: "{{2BHK_CARPET}} sq.ft.", // TODO: confirm
    price: "On request", // TODO: confirm
    image: "/gallery/deck-residence-living.jpg",
    tone: "from-ocean-400 to-ocean-700",
  },
  {
    type: "3 BHK",
    name: "3 Bed Deck Residence",
    description:
      "Expansive three-bedroom residences designed around the deck — generous family living, framed by greenery and skyline views.",
    highlights: ["Extended deck", "Master with walk-in", "Sky-framed views"],
    carpet: "{{3BHK_CARPET}} sq.ft.", // TODO: confirm
    price: "On request", // TODO: confirm
    image: "/gallery/apartment-interior.jpg",
    tone: "from-coral-300 to-coral-500",
  },
];

export type Amenity = { name: string; category: "Wellness" | "Leisure" | "Social" | "Outdoor" };

export const amenities: Amenity[] = [
  { name: "Infinity Pool", category: "Leisure" },
  { name: "Rooftop Sky Deck", category: "Outdoor" },
  { name: "Tropical Landscaped Gardens", category: "Outdoor" },
  { name: "Fully-equipped Gymnasium", category: "Wellness" },
  { name: "Yoga & Meditation Deck", category: "Wellness" },
  { name: "Spa & Sauna", category: "Wellness" },
  { name: "Clubhouse Lounge", category: "Social" },
  { name: "Co-working Spaces", category: "Social" },
  { name: "Banquet & Party Hall", category: "Social" },
  { name: "Children's Play Area", category: "Outdoor" },
  { name: "Amphitheatre", category: "Social" },
  { name: "Jogging & Reflexology Track", category: "Wellness" },
  { name: "Indoor Games Room", category: "Leisure" },
  { name: "Cabana Seating", category: "Outdoor" },
  { name: "Water Features", category: "Outdoor" },
  { name: "Senior Citizens' Corner", category: "Social" },
];

export const amenitiesCount = "40+";

export const tower = {
  eyebrow: "The Tower",
  title: "Thirty-five storeys of considered living.",
  body: "A single landmark tower rising over a layered podium — engineered for light, air and privacy on a 1.75-acre canvas.",
  stats: [
    { value: "35", label: "Storeys" },
    { value: "30", label: "Habitable floors" },
    { value: "4", label: "Podium levels" },
    { value: "1.75", label: "Acres" },
    { value: "40+", label: "Amenities" },
    { value: "2", label: "Basement levels" },
  ],
  levels: [
    { name: "Sky Deck & Crown", floors: "Rooftop", note: "Rooftop sky deck and crown amenities" },
    { name: "Habitable Floors", floors: "30 floors", note: "2 & 3 Bed Deck Residences" },
    { name: "E-Deck", floors: "Amenity deck", note: "Elevated amenity & landscape deck" },
    { name: "Podium", floors: "4 levels", note: "Parking, lobbies & tropical landscaping" },
    { name: "Basements", floors: "2 levels", note: "Parking & services" },
  ],
};

export type Connectivity = { name: string; detail: string; time: string };

export const location = {
  eyebrow: "Location",
  title: "Rooted in Mira Road East. Connected to everywhere.",
  address: "MTNL Road, near Jangid Circle, Mira Road East, Mumbai.",
  body: "A 5–15 minute social ecosystem of schools, hospitals and shopping, woven into Mumbai's fastest-growing infrastructure corridor.",
  // INTERIM royalty-free aerial (Unsplash License). Local copy in /public.
  // TODO: replace with an embedded interactive map / real site aerial before go-live.
  image: "/gallery/aerial-coastline.jpg",
  connectivity: [
    { name: "Metro Line 9", detail: "Sai Baba Nagar & Kashigaon stations", time: "Nearby" },
    { name: "Mira Road Railway", detail: "Western Line connectivity", time: "Minutes away" },
    { name: "Western Express Highway", detail: "Seamless city access", time: "Quick access" },
    { name: "Bullet Train Corridor", detail: "Mumbai–Ahmedabad HSR", time: "Linked" },
    { name: "Vadodara–Mumbai Expressway", detail: "Regional connectivity", time: "Linked" },
    { name: "DMIC", detail: "Delhi–Mumbai Industrial Corridor", time: "Linked" },
  ] as Connectivity[],
};

export type GalleryItem = {
  title: string;
  tone: string; // gradient fallback color behind the image
  /**
   * INTERIM royalty-free stock image (Unsplash License). Local copy in /public/gallery.
   * TODO: replace with real Mayfair Housing renders before go-live.
   */
  image: string;
};

export const gallery: GalleryItem[] = [
  {
    title: "Tropical Arrival Court",
    tone: "from-ocean-700 to-ocean-900",
    image: "/gallery/arrival-court.jpg",
  },
  {
    title: "Infinity Pool Deck",
    tone: "from-ocean-400 to-ocean-700",
    image: "/gallery/infinity-pool.jpg",
  },
  {
    title: "Deck Residence Living",
    tone: "from-sand-300 to-sand-500",
    image: "/gallery/deck-residence-living.jpg",
  },
  {
    title: "Landscaped Podium",
    tone: "from-ocean-300 to-coral-300",
    image: "/gallery/landscaped-podium.jpg",
  },
  {
    title: "Clubhouse Lounge",
    tone: "from-sand-200 to-coral-200",
    image: "/gallery/clubhouse-lounge.jpg",
  },
  {
    title: "Skyline at Golden Hour",
    tone: "from-coral-300 to-coral-500",
    image: "/gallery/skyline-golden-hour.jpg",
  },
];
