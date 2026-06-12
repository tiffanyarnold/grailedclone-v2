// Mock data for the Grailed clone marketplace

export type UserRole = "admin" | "seller" | "buyer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  brand: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  listed_price: number;
  sale_price?: number | null;
  discount?: number | null;
  original_price?: number | null;
  featured?: boolean;
  // Week 1
  min_offer_price?: number | null;
  // Week 2
  competitive_range_min?: number | null;
  competitive_range_max?: number | null;
  last_sold_price?: number | null;
  lowest_ask?: number | null;
  offer_acceptance_rate?: number | null;
  watchers_count?: number;
  created_at: string;
  image_url: string[];
}

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  amount: number;
  status: "pending" | "accepted" | "declined";
  is_competitive?: boolean;
  updated_at?: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  listing_id: string;
  headline: string;
  subheadline: string;
  button_text: string;
  position: number;
  active: boolean;
  image: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
}

export const users: User[] = [
  { id: "admin-1", name: "Jillian Krebsbach", email: "jillian.krebsbach@pursuit.org", role: "admin", password: "Password123!" },
  { id: "admin-2", name: "Tiffany Arnold", email: "tiffanyarnold@pursuit.org", role: "admin", password: "Password123!" },
  { id: "admin-3", name: "Tiffany Arnold", email: "tiffanyoarnold@gmail.com", role: "admin", password: "Password123!" },
  { id: "seller-1", name: "Marcus Chen", email: "marcus@seller.com", role: "seller", password: "Password123!" },
  { id: "seller-2", name: "Elena Rodriguez", email: "elena@seller.com", role: "seller", password: "Password123!" },
  { id: "buyer-1", name: "Jordan Williams", email: "jordan@buyer.com", role: "buyer", password: "Password123!" },
];

export const listings: Listing[] = [
  {
    id: "listing-1",
    seller_id: "seller-1",
    title: "Raf Simons Riot Riot Riot Bomber Jacket",
    brand: "Raf Simons",
    description: "Iconic Raf Simons AW01 Riot Riot Riot bomber jacket. Near mint condition with minimal signs of wear. A true grail piece from one of the most legendary collections.",
    category: "Outerwear",
    size: "M",
    condition: "Gently Used",
    listed_price: 4500,
    created_at: "2026-05-01",
    image_url: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
  },
  {
    id: "listing-2",
    seller_id: "seller-1",
    title: "Rick Owens DRKSHDW Ramones High",
    brand: "Rick Owens",
    description: "Rick Owens DRKSHDW Ramones in black waxed denim. Size 43. Excellent condition, worn sparingly.",
    category: "Footwear",
    size: "43",
    condition: "Gently Used",
    listed_price: 650,
    created_at: "2026-05-05",
    image_url: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"],
  },
  {
    id: "listing-3",
    seller_id: "seller-2",
    title: "Supreme Box Logo Hoodie FW21 Black",
    brand: "Supreme",
    description: "Supreme box logo hoodie from FW21 in black colorway. Deadstock with tags. Size Large.",
    category: "Tops",
    size: "L",
    condition: "New/Never Worn",
    listed_price: 850,
    created_at: "2026-05-10",
    image_url: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", "https://images.unsplash.com/photo-1578768079470-4e3e25d2dbb8?w=800&q=80"],
  },
  {
    id: "listing-4",
    seller_id: "seller-2",
    title: "Chrome Hearts Cemetery Cross Ring",
    brand: "Chrome Hearts",
    description: "Chrome Hearts sterling silver cemetery cross ring. Size 9. Comes with original pouch and receipt.",
    category: "Accessories",
    size: "9",
    condition: "Gently Used",
    listed_price: 1200,
    created_at: "2026-05-12",
    image_url: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"],
  },
  {
    id: "listing-5",
    seller_id: "seller-1",
    title: "Maison Margiela Tabi Boots Black",
    brand: "Maison Margiela",
    description: "Maison Margiela iconic Tabi boots in black leather. Size 42. Worn twice, near perfect condition.",
    category: "Footwear",
    size: "42",
    condition: "Gently Used",
    listed_price: 980,
    created_at: "2026-05-15",
    image_url: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
  },
  {
    id: "listing-6",
    seller_id: "seller-2",
    title: "Undercover Graphic Tee SS20",
    brand: "Undercover",
    description: "Undercover by Jun Takahashi graphic tee from Spring/Summer 2020. Size 3 (L). Minimal wear.",
    category: "Tops",
    size: "L",
    condition: "Gently Used",
    listed_price: 280,
    created_at: "2026-05-18",
    image_url: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"],
  },
  {
    id: "listing-7",
    seller_id: "seller-1",
    title: "Jordan 1 Retro High Travis Scott",
    brand: "Jordan Brand",
    description: "Air Jordan 1 High OG Travis Scott. Deadstock, size 10. Includes all original laces and box.",
    category: "Footwear",
    size: "10",
    condition: "New/Never Worn",
    listed_price: 1800,
    created_at: "2026-05-20",
    image_url: ["https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80", "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80"],
  },
  {
    id: "listing-8",
    seller_id: "seller-2",
    title: "Balenciaga Speed Trainer Black",
    brand: "Balenciaga",
    description: "Balenciaga Speed Trainer in all black. Size 43. Worn a handful of times, great condition.",
    category: "Footwear",
    size: "43",
    condition: "Gently Used",
    listed_price: 550,
    created_at: "2026-05-22",
    image_url: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"],
  },
  {
    id: "listing-9",
    seller_id: "seller-1",
    title: "Comme des Garçons PLAY Heart Tee",
    brand: "Comme des Garçons",
    description: "CDG PLAY white tee with red heart logo. Size XL. Brand new with tags attached.",
    category: "Tops",
    size: "XL",
    condition: "New/Never Worn",
    listed_price: 145,
    created_at: "2026-05-25",
    image_url: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
  },
  {
    id: "listing-10",
    seller_id: "seller-2",
    title: "Acne Studios Leather Biker Jacket",
    brand: "Acne Studios",
    description: "Acne Studios leather biker jacket in classic black. Size 48. Buttery soft lambskin leather.",
    category: "Outerwear",
    size: "48",
    condition: "Gently Used",
    listed_price: 1100,
    created_at: "2026-05-28",
    image_url: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80"],
  },
  {
    id: "listing-11",
    seller_id: "seller-1",
    title: "Dior B23 High Top Oblique",
    brand: "Dior",
    description: "Dior B23 high-top sneaker in Dior Oblique canvas. Size 42. Excellent condition with box.",
    category: "Footwear",
    size: "42",
    condition: "Gently Used",
    listed_price: 890,
    created_at: "2026-06-01",
    image_url: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80", "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80"],
  },
  {
    id: "listing-12",
    seller_id: "seller-2",
    title: "Vetements x Champion Hoodie",
    brand: "Vetements",
    description: "Vetements x Champion oversized hoodie in grey. Size S (oversized fits like XL). Rare piece.",
    category: "Tops",
    size: "S",
    condition: "Gently Used",
    listed_price: 720,
    created_at: "2026-06-03",
    image_url: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"],
  },
  {
    id: "listing-13",
    seller_id: "seller-1",
    title: "Number (N)ine Distressed Denim",
    brand: "Number (N)ine",
    description: "Number (N)ine heavily distressed denim from The High Streets collection. Size 30. Museum quality.",
    category: "Bottoms",
    size: "30",
    condition: "Gently Used",
    listed_price: 2200,
    created_at: "2026-06-05",
    image_url: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"],
  },
  {
    id: "listing-14",
    seller_id: "seller-2",
    title: "Gucci GG Monogram Belt",
    brand: "Gucci",
    description: "Gucci reversible GG Supreme belt with double G buckle. Size 95cm. Like new condition.",
    category: "Accessories",
    size: "95cm",
    condition: "Gently Used",
    listed_price: 380,
    created_at: "2026-06-06",
    image_url: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80"],
  },
  {
    id: "listing-15",
    seller_id: "seller-1",
    title: "Stone Island Shadow Project Jacket",
    brand: "Stone Island",
    description: "Stone Island Shadow Project technical jacket. Size L. Features hidden hood and reflective details.",
    category: "Outerwear",
    size: "L",
    condition: "New/Never Worn",
    listed_price: 1450,
    created_at: "2026-06-07",
    image_url: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"],
  },
  {
    id: "listing-16",
    seller_id: "seller-2",
    title: "Off-White Industrial Belt Yellow",
    brand: "Off-White",
    description: "Off-White industrial belt in signature yellow. One size. Brand new, never worn.",
    category: "Accessories",
    size: "One Size",
    condition: "New/Never Worn",
    listed_price: 220,
    created_at: "2026-06-07",
    image_url: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
  },
  {
    id: "listing-17",
    seller_id: "seller-1",
    title: "Issey Miyake Homme Plissé Pants",
    brand: "Issey Miyake",
    description: "Issey Miyake Homme Plissé pleated wide-leg pants in black. Size 3. Perfect drape.",
    category: "Bottoms",
    size: "3",
    condition: "Gently Used",
    listed_price: 340,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80"],
  },
  {
    id: "listing-18",
    seller_id: "seller-2",
    title: "Yohji Yamamoto Pour Homme Blazer",
    brand: "Yohji Yamamoto",
    description: "Yohji Yamamoto Pour Homme deconstructed wool blazer. Size 3. Architectural masterpiece.",
    category: "Outerwear",
    size: "3",
    condition: "Gently Used",
    listed_price: 890,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
  },
  {
    id: "listing-19",
    seller_id: "seller-1",
    title: "A Bathing Ape Shark Hoodie",
    brand: "BAPE",
    description: "BAPE Full Zip Shark Hoodie in blue camo. Size L. Deadstock with tags.",
    category: "Tops",
    size: "L",
    condition: "New/Never Worn",
    listed_price: 520,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", "https://images.unsplash.com/photo-1578768079470-4e3e25d2dbb8?w=800&q=80"],
  },
  {
    id: "listing-20",
    seller_id: "seller-2",
    title: "New Balance 550 White Green",
    brand: "New Balance",
    description: "New Balance 550 in white/green colorway. Size 10.5. Worn once, like new.",
    category: "Footwear",
    size: "10.5",
    condition: "Gently Used",
    listed_price: 165,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"],
  },
  {
    id: "listing-21",
    seller_id: "seller-1",
    title: "BAPE Camo Snapback Cap",
    brand: "BAPE",
    description: "BAPE A Bathing Ape camo snapback. One size fits all. Great condition.",
    category: "Hats",
    size: "One Size",
    condition: "Gently Used",
    listed_price: 85,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"],
  },
  {
    id: "listing-22",
    seller_id: "seller-2",
    title: "Supreme Box Logo New Era Cap",
    brand: "Supreme",
    description: "Supreme x New Era fitted cap with box logo embroidery. Size 7 3/8. Deadstock.",
    category: "Hats",
    size: "7 3/8",
    condition: "New/Never Worn",
    listed_price: 95,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80"],
  },
  {
    id: "listing-23",
    seller_id: "seller-1",
    title: "Stussy Stock Low Pro Cap",
    brand: "Stussy",
    description: "Stussy low profile cap in black with script logo. One size. Minimal wear.",
    category: "Hats",
    size: "One Size",
    condition: "Gently Used",
    listed_price: 45,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80"],
  },
  {
    id: "listing-24",
    seller_id: "seller-2",
    title: "Supreme 5-Panel Camp Cap",
    brand: "Supreme",
    description: "Supreme 5-panel camp cap in red with circle logo patch. One size. Brand new.",
    category: "Hats",
    size: "One Size",
    condition: "New/Never Worn",
    listed_price: 78,
    created_at: "2026-06-08",
    image_url: ["https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80"],
  },
  {
    id: "listing-25",
    seller_id: "seller-1",
    title: "Chrome Hearts Chain Bracelet",
    brand: "Chrome Hearts",
    description: "Chrome Hearts sterling silver chain bracelet with cross charm. Excellent condition.",
    category: "Accessories",
    size: "One Size",
    condition: "Gently Used",
    listed_price: 850,
    created_at: "2026-06-09",
    image_url: ["https://images.unsplash.com/photo-1573408301185-9519f94f8b81?w=800&q=80"],
  },
  {
    id: "listing-26",
    seller_id: "seller-2",
    title: "Louis Vuitton Monogram Belt",
    brand: "Louis Vuitton",
    description: "Louis Vuitton monogram canvas belt with gold buckle. Size 90cm. Like new.",
    category: "Accessories",
    size: "90cm",
    condition: "Gently Used",
    listed_price: 420,
    created_at: "2026-06-09",
    image_url: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
  },
  {
    id: "listing-27",
    seller_id: "seller-1",
    title: "Supreme North Face Backpack",
    brand: "Supreme",
    description: "Supreme x The North Face backpack. Black colorway. Gently used with minimal wear.",
    category: "Accessories",
    size: "One Size",
    condition: "Gently Used",
    listed_price: 320,
    created_at: "2026-06-09",
    image_url: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    listing_id: "listing-1",
    headline: "Archive Under $300",
    subheadline: "RAF SIMONS, UNDERCOVER + MORE",
    button_text: "SHOP NOW",
    position: 1,
    active: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=90",
  },
  {
    id: "hero-2",
    listing_id: "listing-7",
    headline: "Grails Under $500",
    subheadline: "JORDAN BRAND, NIKE, TRAVIS SCOTT +MORE",
    button_text: "SHOP NOW",
    position: 2,
    active: true,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=90",
  },
  {
    id: "hero-3",
    listing_id: "listing-4",
    headline: "The Jewelry Edit",
    subheadline: "CHROME HEARTS, VIVIENNE WESTWOOD +MORE",
    button_text: "SHOP NOW",
    position: 3,
    active: true,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90",
  },
];

export const offers: Offer[] = [
  { id: "offer-1", listing_id: "listing-1", buyer_id: "buyer-1", amount: 4000, status: "pending", created_at: "2026-06-05" },
  { id: "offer-2", listing_id: "listing-3", buyer_id: "buyer-1", amount: 600, status: "pending", created_at: "2026-06-06" },
  { id: "offer-3", listing_id: "listing-5", buyer_id: "buyer-1", amount: 850, status: "pending", created_at: "2026-06-07" },
  { id: "offer-4", listing_id: "listing-7", buyer_id: "buyer-1", amount: 1500, status: "pending", created_at: "2026-06-08" },
];

export const favorites: Favorite[] = [
  { id: "fav-1", user_id: "buyer-1", listing_id: "listing-1" },
  { id: "fav-2", user_id: "buyer-1", listing_id: "listing-4" },
];

// Collections for homepage
export interface Collection {
  id: string;
  brands: string;
  title: string;
  description?: string;
  listings: string[];
  heroImage?: string;
}

export const collections: Collection[] = [
  {
    id: "col-1",
    brands: "MAISON MARGIELA, ACNE STUDIOS, VETEMENTS +MORE",
    title: "Trending: Apparel",
    listings: ["listing-3", "listing-6", "listing-12", "listing-19"],
  },
  {
    id: "col-2",
    brands: "From Grailed",
    title: "Get In Your Bag",
    listings: ["listing-14", "listing-16", "listing-4", "listing-14"],
  },
  {
    id: "col-3",
    brands: "PRADA, LEVI'S, JAPANESE BRAND +MORE",
    title: "Trending: Footwear",
    listings: ["listing-2", "listing-7", "listing-8", "listing-20"],
  },
  {
    id: "col-4",
    brands: "CHROME HEARTS, VIVIENNE WESTWOOD +MORE",
    title: "Chromed Out",
    listings: ["listing-4", "listing-14", "listing-16", "listing-4"],
  },
  {
    id: "col-5",
    brands: "RICK OWENS, CELINE, JAPANESE BRAND +MORE",
    title: "Dark Luxury",
    listings: ["listing-10", "listing-18", "listing-5", "listing-6"],
  },
  {
    id: "col-6",
    brands: "ADIDAS, LEVI'S, VETEMENTS +MORE",
    title: "Court Icons",
    listings: ["listing-7", "listing-20", "listing-8", "listing-11"],
  },
];

export const editorialSections = [
  {
    id: "edit-1",
    categoryLabel: "Trending Now",
    title: "The Jewelry Edit",
    description: "From rings and bracelets to necklaces and wallet chains, shop our favorite jewelry from Chrome Hearts, Vivienne Westwood, Werkstatt Munchen and more.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1400&q=90",
    collection: "col-2",
  },
  {
    id: "edit-2",
    categoryLabel: "Editorial",
    title: "Dark Luxury",
    description: "The best of avant-garde and dark aesthetic fashion. Shop Rick Owens, Undercover, Julius and more.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=90",
    collection: "col-5",
  },
  {
    id: "edit-3",
    categoryLabel: "Closet Staples",
    title: "Summer Tees",
    description: "Shop the hottest tees for summer, with styles from Supreme, Balenciaga, vintage graphics and more.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1400&q=90",
    collection: "col-1",
  },
];

// Helper functions
export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsBySeller(sellerId: string): Listing[] {
  return listings.filter((l) => l.seller_id === sellerId);
}

export function getOffersByListing(listingId: string): Offer[] {
  return offers.filter((o) => o.listing_id === listingId);
}

export function getOffersBySeller(sellerId: string): Offer[] {
  const sellerListings = getListingsBySeller(sellerId);
  const listingIds = sellerListings.map((l) => l.id);
  return offers.filter((o) => listingIds.includes(o.listing_id));
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function isOfferCompetitive(offerAmount: number, listingPrice: number): boolean {
  return offerAmount >= listingPrice * 0.85;
}
