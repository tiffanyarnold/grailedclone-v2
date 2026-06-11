import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    // Seed demo users
    const demoUsers = [
      { email: 'jillian.krebsbach@pursuit.org', password: 'Password123!', name: 'Jillian Krebsbach', role: 'admin' },
      { email: 'tiffanyarnold@pursuit.org', password: 'Password123!', name: 'Tiffany Arnold', role: 'admin' },
      { email: 'tiffanyoarnold@gmail.com', password: 'Password123!', name: 'Tiffany Arnold', role: 'admin' },
      { email: 'marcus@seller.com', password: 'Password123!', name: 'Marcus Chen', role: 'seller' },
      { email: 'elena@seller.com', password: 'Password123!', name: 'Elena Rodriguez', role: 'seller' },
      { email: 'jordan@buyer.com', password: 'Password123!', name: 'Jordan Williams', role: 'buyer' },
    ];

    const userIdMap: Record<string, string> = {};

    for (const u of demoUsers) {
      // Try to get existing user first
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existing?.users?.find((x: any) => x.email === u.email);
      
      let userId: string;
      if (existingUser) {
        userId = existingUser.id;
        // Update profile
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          email: u.email,
          name: u.name,
          role: u.role,
        });
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { name: u.name, role: u.role },
        });
        if (error) throw error;
        userId = data.user.id;
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          email: u.email,
          name: u.name,
          role: u.role,
        });
      }
      userIdMap[u.email] = userId;
    }

    const seller1 = userIdMap['marcus@seller.com'];
    const seller2 = userIdMap['elena@seller.com'];
    const buyer1 = userIdMap['jordan@buyer.com'];

    // Check if listings already seeded
    const { count } = await supabaseAdmin.from('listings').select('*', { count: 'exact', head: true });
    if ((count ?? 0) > 0) {
      return new Response(JSON.stringify({ message: 'Already seeded', userIdMap }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
      });
    }

    // Seed listings
    const listingsData = [
      { seller_id: seller1, title: 'Raf Simons Riot Riot Riot Bomber Jacket', brand: 'Raf Simons', description: 'Iconic Raf Simons AW01 Riot Riot Riot bomber jacket. Near mint condition with minimal signs of wear. A true grail piece from one of the most legendary collections.', category: 'Outerwear', size: 'M', condition: 'Gently Used', price: 4500, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'] },
      { seller_id: seller1, title: 'Rick Owens DRKSHDW Ramones High', brand: 'Rick Owens', description: 'Rick Owens DRKSHDW Ramones in black waxed denim. Size 43. Excellent condition, worn sparingly.', category: 'Footwear', size: '43', condition: 'Gently Used', price: 650, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'] },
      { seller_id: seller2, title: 'Supreme Box Logo Hoodie FW21 Black', brand: 'Supreme', description: 'Supreme box logo hoodie from FW21 in black colorway. Deadstock with tags. Size Large.', category: 'Tops', size: 'L', condition: 'New/Never Worn', price: 850, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 'https://images.unsplash.com/photo-1578768079470-4e3e25d2dbb8?w=800&q=80'] },
      { seller_id: seller2, title: 'Chrome Hearts Cemetery Cross Ring', brand: 'Chrome Hearts', description: 'Chrome Hearts sterling silver cemetery cross ring. Size 9. Comes with original pouch and receipt.', category: 'Accessories', size: '9', condition: 'Gently Used', price: 1200, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'] },
      { seller_id: seller1, title: 'Maison Margiela Tabi Boots Black', brand: 'Maison Margiela', description: 'Maison Margiela iconic Tabi boots in black leather. Size 42. Worn twice, near perfect condition.', category: 'Footwear', size: '42', condition: 'Gently Used', price: 980, images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'] },
      { seller_id: seller2, title: 'Undercover Graphic Tee SS20', brand: 'Undercover', description: 'Undercover by Jun Takahashi graphic tee from Spring/Summer 2020. Size 3 (L). Minimal wear.', category: 'Tops', size: 'L', condition: 'Gently Used', price: 280, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'] },
      { seller_id: seller1, title: 'Jordan 1 Retro High Travis Scott', brand: 'Jordan Brand', description: 'Air Jordan 1 High OG Travis Scott. Deadstock, size 10. Includes all original laces and box.', category: 'Footwear', size: '10', condition: 'New/Never Worn', price: 1800, images: ['https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80'] },
      { seller_id: seller2, title: 'Balenciaga Speed Trainer Black', brand: 'Balenciaga', description: 'Balenciaga Speed Trainer in all black. Size 43. Worn a handful of times, great condition.', category: 'Footwear', size: '43', condition: 'Gently Used', price: 550, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'] },
      { seller_id: seller1, title: 'Comme des Garçons PLAY Heart Tee', brand: 'Comme des Garçons', description: 'CDG PLAY white tee with red heart logo. Size XL. Brand new with tags attached.', category: 'Tops', size: 'XL', condition: 'New/Never Worn', price: 145, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'] },
      { seller_id: seller2, title: 'Acne Studios Leather Biker Jacket', brand: 'Acne Studios', description: 'Acne Studios leather biker jacket in classic black. Size 48. Buttery soft lambskin leather.', category: 'Outerwear', size: '48', condition: 'Gently Used', price: 1100, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80'] },
      { seller_id: seller1, title: 'Dior B23 High Top Oblique', brand: 'Dior', description: 'Dior B23 high-top sneaker in Dior Oblique canvas. Size 42. Excellent condition with box.', category: 'Footwear', size: '42', condition: 'Gently Used', price: 890, images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80'] },
      { seller_id: seller2, title: 'Vetements x Champion Hoodie', brand: 'Vetements', description: 'Vetements x Champion oversized hoodie in grey. Size S (oversized fits like XL). Rare piece.', category: 'Tops', size: 'S', condition: 'Gently Used', price: 720, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'] },
      { seller_id: seller1, title: 'Number (N)ine Distressed Denim', brand: 'Number (N)ine', description: 'Number (N)ine heavily distressed denim from The High Streets collection. Size 30. Museum quality.', category: 'Bottoms', size: '30', condition: 'Gently Used', price: 2200, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'] },
      { seller_id: seller2, title: 'Gucci GG Monogram Belt', brand: 'Gucci', description: 'Gucci reversible GG Supreme belt with double G buckle. Size 95cm. Like new condition.', category: 'Accessories', size: '95cm', condition: 'Gently Used', price: 380, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80'] },
      { seller_id: seller1, title: 'Stone Island Shadow Project Jacket', brand: 'Stone Island', description: 'Stone Island Shadow Project technical jacket. Size L. Features hidden hood and reflective details.', category: 'Outerwear', size: 'L', condition: 'New/Never Worn', price: 1450, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80'] },
      { seller_id: seller2, title: 'Off-White Industrial Belt Yellow', brand: 'Off-White', description: 'Off-White industrial belt in signature yellow. One size. Brand new, never worn.', category: 'Accessories', size: 'One Size', condition: 'New/Never Worn', price: 220, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'] },
      { seller_id: seller1, title: 'Issey Miyake Homme Plissé Pants', brand: 'Issey Miyake', description: 'Issey Miyake Homme Plissé pleated wide-leg pants in black. Size 3. Perfect drape.', category: 'Bottoms', size: '3', condition: 'Gently Used', price: 340, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'] },
      { seller_id: seller2, title: 'Yohji Yamamoto Pour Homme Blazer', brand: 'Yohji Yamamoto', description: 'Yohji Yamamoto Pour Homme deconstructed wool blazer. Size 3. Architectural masterpiece.', category: 'Outerwear', size: '3', condition: 'Gently Used', price: 890, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'] },
      { seller_id: seller1, title: 'A Bathing Ape Shark Hoodie', brand: 'BAPE', description: 'BAPE Full Zip Shark Hoodie in blue camo. Size L. Deadstock with tags.', category: 'Tops', size: 'L', condition: 'New/Never Worn', price: 520, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', 'https://images.unsplash.com/photo-1578768079470-4e3e25d2dbb8?w=800&q=80'] },
      { seller_id: seller2, title: 'New Balance 550 White Green', brand: 'New Balance', description: 'New Balance 550 in white/green colorway. Size 10.5. Worn once, like new.', category: 'Footwear', size: '10.5', condition: 'Gently Used', price: 165, images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'] },
      { seller_id: seller1, title: 'Maison Margiela FW17 Playing Card Silk Blouse', brand: 'Maison Margiela', description: 'Maison Margiela FW17 Playing Card Silk Blouse. Rare piece from the iconic Fall/Winter 2017 collection featuring a stunning playing card graphic print on luxurious silk. A true collector\'s grail. Size IT 38. Excellent condition with minimal wear.', category: 'Tops', size: 'IT 38', condition: 'Gently Used', price: 780, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'] },
    ];

    const { data: insertedListings, error: listErr } = await supabaseAdmin
      .from('listings')
      .insert(listingsData)
      .select('id, title');
    if (listErr) throw listErr;

    // Map title to id for hero slides and offers
    const titleToId: Record<string, string> = {};
    for (const l of insertedListings ?? []) {
      titleToId[l.title] = l.id;
    }

    // Seed hero slides
    const heroData = [
      { listing_id: titleToId['Raf Simons Riot Riot Riot Bomber Jacket'], headline: 'Archive Under $300', subheadline: 'RAF SIMONS, UNDERCOVER + MORE', button_text: 'SHOP NOW', position: 1, active: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=90' },
      { listing_id: titleToId['Jordan 1 Retro High Travis Scott'], headline: 'Grails Under $500', subheadline: 'JORDAN BRAND, NIKE, TRAVIS SCOTT +MORE', button_text: 'SHOP NOW', position: 2, active: true, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=90' },
      { listing_id: titleToId['Chrome Hearts Cemetery Cross Ring'], headline: 'The Jewelry Edit', subheadline: 'CHROME HEARTS, VIVIENNE WESTWOOD +MORE', button_text: 'SHOP NOW', position: 3, active: true, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90' },
    ];

    await supabaseAdmin.from('hero_slides').insert(heroData);

    // Seed offers
    const offersData = [
      { listing_id: titleToId['Raf Simons Riot Riot Riot Bomber Jacket'], buyer_id: buyer1, amount: 4000, status: 'pending' },
      { listing_id: titleToId['Supreme Box Logo Hoodie FW21 Black'], buyer_id: buyer1, amount: 600, status: 'pending' },
      { listing_id: titleToId['Maison Margiela Tabi Boots Black'], buyer_id: buyer1, amount: 850, status: 'pending' },
      { listing_id: titleToId['Jordan 1 Retro High Travis Scott'], buyer_id: buyer1, amount: 1500, status: 'pending' },
    ];

    await supabaseAdmin.from('offers').insert(offersData);

    // Seed favorites
    const favoritesData = [
      { user_id: buyer1, listing_id: titleToId['Raf Simons Riot Riot Riot Bomber Jacket'] },
      { user_id: buyer1, listing_id: titleToId['Chrome Hearts Cemetery Cross Ring'] },
    ];

    await supabaseAdmin.from('favorites').insert(favoritesData);

    return new Response(JSON.stringify({ message: 'Seeded successfully', userIdMap }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  }
});
