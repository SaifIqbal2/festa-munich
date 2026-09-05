import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../supabaseClient';
import { generateOrderId } from '../utils/helpers';

const ShopContext = createContext();

const LOCAL_STORAGE_WISHLIST_KEY = 'festa_munich_wishlist_v2';
const LOCAL_STORAGE_REVIEWS_KEY = 'festa_munich_reviews_v2';
export const ShopProvider = ({ children }) => {
  // Categories State - LIVE from Supabase
  const [categories, setCategories] = useState([]);
  
  // Products State - LIVE from Supabase
  const [products, setProducts] = useState([]);

  // Orders State - LIVE from Supabase
  const [orders, setOrders] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  // Reviews & Ratings
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Coupons & Discounts
  const [availableCoupons, setAvailableCoupons] = useState([
    { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, is_active: true, description: '10% off for first-time customers' },
    { code: 'SUMMER20', discount_type: 'percentage', discount_value: 20, is_active: true, description: '20% off summer collection' },
    { code: 'VIPEXCLUSIVE', discount_type: 'fixed', discount_value: 50, is_active: true, description: '$50 off orders over $500' }
  ]);
  const [availableGiftCards, setAvailableGiftCards] = useState([]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState(null);

  const [cart, setCart] = useState([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const cartSyncQueueRef = useRef(Promise.resolve());

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [currency, setCurrency] = useState('USD');
  const [heroSlides, setHeroSlides] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Garments');
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const generateUuid = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  };

  const mapSupabaseUser = (authUser, profile = {}) => ({
    id: authUser.id,
    fullName: profile.full_name || authUser.user_metadata?.full_name || '',
    email: authUser.email || profile.email || '',
    phone: profile.phone || authUser.user_metadata?.phone || '',
    address: profile.address || authUser.user_metadata?.address || '',
    city: profile.city || authUser.user_metadata?.city || '',
    country: profile.country || authUser.user_metadata?.country || 'Pakistan',
    postalCode: profile.postal_code || authUser.user_metadata?.postal_code || '',
    isAdmin: authUser.app_metadata?.role === 'admin' || authUser.user_metadata?.role === 'admin',
    createdAt: authUser.created_at,
    orders: [],
    cart: []
  });

  const loadUserCart = async (userId) => {
    const client = getSupabaseClient();
    if (!client || !userId) {
      setCart([]);
      setCartHydrated(true);
      return;
    }

    const { data, error } = await client
      .from('user_cart')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Cart load error:', error);
      setCart([]);
    } else {
      setCart((data || []).map((item) => ({
        cartItemId: `${item.product_id}-${item.selected_size || 'Standard'}-${item.selected_color || 'Original'}`,
        id: item.product_id,
        title: item.title,
        price: Number(item.price),
        image: item.image || '',
        material: item.material || '',
        selectedSize: item.selected_size || 'Standard',
        selectedColor: item.selected_color || 'Original',
        quantity: item.quantity
      })));
    }
    setCartHydrated(true);
  };

  const loadSupabaseUser = async (authUser) => {
    if (!authUser) {
      setCurrentUser(null);
      setCart([]);
      setCartHydrated(true);
      return null;
    }

    const client = getSupabaseClient();
    if (!client) return null;
    const { data: profile, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') console.error('Profile load error:', error);
    const user = mapSupabaseUser(authUser, profile || {});
    setCartHydrated(false);
    setCurrentUser(user);
    await loadUserCart(authUser.id);
    return user;
  };

  const ensureSupabaseProfile = async (authUser) => {
    const client = getSupabaseClient();
    if (!client || !authUser) return null;
    const metadata = authUser.user_metadata || {};
    const { error } = await client.from('user_profiles').upsert({
      id: authUser.id,
      email: authUser.email,
      full_name: metadata.full_name || '',
      phone: metadata.phone || null,
      address: metadata.address || null,
      city: metadata.city || null,
      country: metadata.country || 'Pakistan',
      postal_code: metadata.postal_code || null,
      email_verified: Boolean(authUser.email_confirmed_at)
    }, { onConflict: 'id' });
    if (error) {
      console.error('Profile sync error:', error);
      return null;
    }
    return loadSupabaseUser(authUser);
  };

  const registerUser = async ({ fullName, email, password, phone, address, city, country, postalCode }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const trimmedName = String(fullName || '').trim();

    if (!trimmedName || !cleanEmail || !password || !String(password).trim()) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase is not configured.' };

    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password: String(password).trim(),
      options: {
        data: { full_name: trimmedName, phone, address, city, country, postal_code: postalCode }
      }
    });

    if (error) return { success: false, message: error.message };
    if (!data.user) return { success: false, message: 'Account could not be created.' };

    if (data.session) {
      const user = await ensureSupabaseProfile(data.user);
      if (!user) return { success: false, message: 'Account profile could not be created.' };
      return { success: true, user, message: 'Account created successfully.' };
    }

    return { success: true, user: null, message: 'Account created. Check your email to confirm your account.' };
  };

  const loginUser = async ({ email, password }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Email and password are required.' };
    }

    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase is not configured.' };
    const { data, error } = await client.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
    if (error || !data.user) return { success: false, message: error?.message || 'Invalid email or password.' };
    const safeUser = await loadSupabaseUser(data.user);
    if (safeUser?.isAdmin) {
      setIsAdminOpen(true);
    }
    return { success: true, user: safeUser, message: 'Login successful.' };
  };

  const logoutUser = async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setCurrentUser(null);
    setIsAdminOpen(false);
    return true;
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) {
      return { success: false, message: 'Please login to update your profile.' };
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
      email: (updates.email || currentUser.email).trim().toLowerCase(),
      fullName: (updates.fullName || currentUser.fullName).trim(),
      address: updates.address || currentUser.address || '',
      city: updates.city || currentUser.city || '',
      country: updates.country || currentUser.country || 'Pakistan',
      postalCode: updates.postalCode || currentUser.postalCode || '',
      phone: updates.phone || currentUser.phone || ''
    };
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase is not configured.' };
    const { error } = await client.from('user_profiles').update({
      email: updatedUser.email,
      full_name: updatedUser.fullName,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      country: updatedUser.country,
      postal_code: updatedUser.postalCode
    }).eq('id', currentUser.id);
    if (error) return { success: false, message: error.message };
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser, message: 'Profile updated successfully.' };
  };

  const userOrders = currentUser ? orders.filter(order => order.user_id === currentUser.id || order.userId === currentUser.id || order.customer_email?.toLowerCase() === currentUser.email.toLowerCase()) : [];

  // Persist only the logged-in user's cart in Supabase.
  useEffect(() => {
    if (!currentUser || !cartHydrated) return;
    const client = getSupabaseClient();
    if (!client) return;

    const cartSnapshot = cart.map((item) => ({
      user_id: currentUser.id,
      product_id: item.id,
      title: item.title,
      price: Number(item.price),
      image: item.image || null,
      material: item.material || null,
      selected_size: item.selectedSize || null,
      selected_color: item.selectedColor || null,
      quantity: Number(item.quantity)
    }));

    cartSyncQueueRef.current = cartSyncQueueRef.current.then(async () => {
      const { error: deleteError } = await client.from('user_cart').delete().eq('user_id', currentUser.id);
      if (deleteError) {
        console.error('Cart delete sync error:', deleteError);
        return;
      }
      if (cartSnapshot.length === 0) return;
      const { error: insertError } = await client.from('user_cart').insert(cartSnapshot);
      if (insertError) console.error('Cart insert sync error:', insertError);
    });
  }, [cart, currentUser, cartHydrated]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return undefined;
    client.auth.getSession().then(({ data }) => {
      if (data.session?.user) loadSupabaseUser(data.session.user);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadSupabaseUser(session.user);
      else loadSupabaseUser(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;
    const loadCommerceOffers = async () => {
      const [{ data: coupons, error: couponError }, { data: giftCards, error: giftCardError }] = await Promise.all([
        client.from('coupon_codes').select('*').eq('active', true),
        client.from('gift_cards').select('*').eq('is_active', true)
      ]);
      if (!couponError && coupons?.length) {
        setAvailableCoupons(coupons.map((coupon) => ({ ...coupon, is_active: coupon.active })));
      }
      if (!giftCardError) setAvailableGiftCards(giftCards || []);
    };
    loadCommerceOffers();
  }, []);

  // Fetch ALL data from Supabase directly
  const fetchHeroSlidesFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setHeroSlides([]);
      return [];
    }

    const client = getSupabaseClient();
    if (!client) {
      setHeroSlides([]);
      return [];
    }

    try {
      const { data, error } = await client
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching hero slides:', error);
        setHeroSlides([]);
        return [];
      }

      if (data && data.length > 0) {
        const mapped = data.map(slide => ({
          id: slide.id,
          heading: slide.heading || 'Untitled Slide',
          subtitle: slide.subtitle || '',
          buttonText: slide.button_text || 'Discover More',
          image: slide.image || '',
          is_active: slide.is_active !== false,
          display_order: slide.display_order || 0
        }));
        setHeroSlides(mapped);
        return mapped;
      }

      setHeroSlides([]);
      return [];
    } catch (err) {
      console.error('❌ Hero slides fetch error:', err);
      setHeroSlides([]);
      return [];
    }
  };

  const saveHeroSlidesToSupabase = async (slidesToSave = heroSlides) => {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    try {
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session) {
        return { success: false, message: 'Please log in with your Supabase admin account.' };
      }
      if (sessionData.session.user.app_metadata?.role !== 'admin') {
        return { success: false, message: 'This account is not a Supabase admin. Set role=admin in Raw App Metadata, then log in again.' };
      }

      const slides = slidesToSave.map((slide, index) => ({
        id: slide.id,
        heading: slide.heading || 'Untitled Slide',
        subtitle: slide.subtitle || '',
        button_text: slide.buttonText || 'Discover More',
        image: slide.image || '',
        is_active: slide.is_active !== false,
        display_order: slide.display_order ?? index
      }));

      const { error: upsertError } = await client
        .from('hero_slides')
        .upsert(slides, { onConflict: 'id' })
        .select('id, heading, subtitle, button_text, image, display_order, is_active');

      if (upsertError) throw upsertError;

      await fetchHeroSlidesFromSupabase();
      return { success: true, message: 'Hero slides saved successfully.' };
    } catch (err) {
      console.error('❌ Save hero slides error:', err);
      return { success: false, message: err.message || 'Hero slides could not be saved.' };
    }
  };

  const fetchAllDataFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured');
      return;
    }
    
    const client = getSupabaseClient();
    if (!client) {
      console.log('⚠️ Supabase client unavailable');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch Categories with Subcategories
      const { data: categoriesData, error: catErr } = await client
        .from('categories')
        .select(`
          *,
          subcategories (
            id,
            name,
            slug,
            display_order
          )
        `)
        .order('display_order', { ascending: true });

      if (catErr) {
        console.error('❌ Error fetching categories:', catErr);
      } else if (categoriesData && categoriesData.length > 0) {
        console.log('✅ Loaded', categoriesData.length, 'categories from Supabase');
        setCategories(categoriesData);
      } else {
        console.log('ℹ️ No categories found - check Supabase');
      }

      // Fetch Products
      const { data: productsData, error: prodErr } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodErr) {
        console.error('❌ Error fetching products:', prodErr);
      } else if (productsData && productsData.length > 0) {
        console.log('✅ Loaded', productsData.length, 'products from Supabase');
        setProducts(productsData);
      } else {
        console.log('ℹ️ No products yet - use Admin Dashboard to add products');
      }

      // Fetch Orders
      const { data: ordersData, error: ordErr } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordErr) {
        console.error('❌ Error fetching orders:', ordErr);
      } else if (ordersData && ordersData.length > 0) {
        console.log('✅ Loaded', ordersData.length, 'orders from Supabase');
        setOrders(ordersData);
      }

      await fetchHeroSlidesFromSupabase();
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHeroSlide = async (slideId) => {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase is not configured.' };
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData.session?.user.app_metadata?.role !== 'admin') {
      return { success: false, message: 'This account is not a Supabase admin.' };
    }
    const { error } = await client.from('hero_slides').delete().eq('id', slideId);
    if (error) return { success: false, message: error.message };
    setHeroSlides((slides) => slides.filter((slide) => slide.id !== slideId));
    return { success: true, message: 'Slide removed.' };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllDataFromSupabase();
    
    // Auto-refresh less aggressively while admin forms are open to prevent UI churn
    const interval = setInterval(() => {
      fetchAllDataFromSupabase();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Category CRUD
  const addCategory = async (categoryName) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) return;

    const safeSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = {
      id: generateUuid(),
      name: trimmedName,
      description: `Custom category: ${trimmedName}`,
      slug: safeSlug || `category-${Date.now()}`,
      is_active: true,
      display_order: categories.length + 1,
      subcategories: []
    };

    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully.`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client.from('categories').insert([
            {
              name: newCat.name,
              description: newCat.description,
              slug: newCat.slug,
              is_active: newCat.is_active,
              display_order: newCat.display_order
            }
          ]).select();

          if (error) {
            throw error;
          }

          if (data && data[0]) {
            setCategories(prev => prev.map(cat => (cat.id === newCat.id ? { ...data[0], subcategories: [] } : cat)));
          }
        } catch (e) {
          console.error('Add category error:', e);
          setCategories(prev => prev.filter(cat => cat.id !== newCat.id));
          showToast('Category could not be saved to Supabase.', 'error');
        }
      }
    }
  };

  const updateCategory = async (categoryId, newName) => {
    const trimmed = newName.trim();
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, name: trimmed } : c))
    );
    showToast(`Category updated.`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('categories').update({ name: trimmed }).eq('id', categoryId);
        } catch (e) {
          console.error('Update category error:', e);
        }
      }
    }
  };

  const deleteCategory = async (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast(`Category "${cat?.name || ''}" removed.`, 'info');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('categories').delete().eq('id', categoryId);
        } catch (e) {
          console.error('Delete category error:', e);
        }
      }
    }
  };

  const addSubcategory = async (categoryId, subcategoryName) => {
    const trimmedName = subcategoryName.trim();
    if (!trimmedName) return;

    const normalized = (categories.find(c => c.id === categoryId)?.subcategories || []).map(s => typeof s === 'string' ? s : s.name);
    if (normalized.includes(trimmedName)) {
      return;
    }

    const newSub = {
      id: generateUuid(),
      category_id: categoryId,
      name: trimmedName,
      slug: trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      is_active: true,
      display_order: normalized.length + 1
    };

    setCategories(prev =>
      prev.map(c => {
        if (c.id === categoryId) {
          const currentSubs = c.subcategories || [];
          return { ...c, subcategories: [...currentSubs, newSub] };
        }
        return c;
      })
    );
    showToast(`Sub-category "${trimmedName}" added.`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { error } = await client.from('subcategories').insert([{
            category_id: newSub.category_id,
            name: newSub.name,
            slug: newSub.slug,
            is_active: newSub.is_active,
            display_order: newSub.display_order
          }]);

          if (error) throw error;
        } catch (e) {
          console.error('Add subcategory error:', e);
          setCategories(prev =>
            prev.map(c => {
              if (c.id === categoryId) {
                return {
                  ...c,
                  subcategories: (c.subcategories || []).filter(s =>
                    (typeof s === 'string' ? s : s.name) !== trimmedName
                  )
                };
              }
              return c;
            })
          );
          showToast('Sub-category could not be saved to Supabase.', 'error');
        }
      }
    }
  };

  const deleteSubcategory = async (categoryId, subcategoryName) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            subcategories: (c.subcategories || []).filter(s => (typeof s === 'string' ? s : s.name) !== subcategoryName)
          };
        }
        return c;
      })
    );
    showToast(`Sub-category "${subcategoryName}" removed.`, 'info');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('subcategories').delete().eq('category_id', categoryId).eq('name', subcategoryName);
        } catch (e) {
          console.error('Delete subcategory error:', e);
        }
      }
    }
  };

  // Product CRUD
  const addProduct = async (newProductData) => {
    const newProduct = {
      id: generateUuid(),
      ...newProductData,
      created_at: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.title}" added to catalog.`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data, error } = await client.from('products').insert([newProduct]).select();
          if (error) throw error;

          if (data && data[0]) {
            setProducts(prev => prev.map(prod => prod.id === newProduct.id ? { ...data[0] } : prod));
          }
        } catch (e) {
          console.error('Add product error:', e);
          setProducts(prev => prev.filter(prod => prod.id !== newProduct.id));
          showToast('Product could not be saved to Supabase.', 'error');
        }
      }
    }
  };

  const updateProduct = async (id, updatedData) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedData } : p)));
    showToast(`Product details updated.`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('products').update(updatedData).eq('id', id);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const deleteProduct = async (id) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product "${prod?.title || id}" removed.`, 'info');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.from('products').delete().eq('id', id);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Orders Management
  const createOrder = async (orderPayload) => {
    const orderNumber = generateOrderId();
    let orderUserId = currentUser?.id || null;

    if (orderUserId && isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error: profileError } = await client.from('user_profiles').upsert({
          id: orderUserId,
          email: currentUser.email,
          full_name: currentUser.fullName || '',
          phone: currentUser.phone || null,
          address: currentUser.address || null,
          city: currentUser.city || null,
          country: currentUser.country || 'Pakistan',
          postal_code: currentUser.postalCode || null
        }, { onConflict: 'id' });

        if (profileError) {
          console.error('Order profile sync error; saving order without user_id:', profileError);
          orderUserId = null;
        }
      }
    }

    const newOrder = {
      id: generateUuid(),
      order_number: orderNumber,
      status: 'Pending',
      created_at: new Date().toISOString(),
      tracking_notes: 'Order received by Festa Munich atelier. Under preparation.',
      user_id: orderUserId,
      ...orderPayload
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    if (currentUser) setCurrentUser(prev => ({ ...prev, cart: [], orders: [newOrder, ...(prev.orders || [])] }));

    showToast(`Order #${orderNumber} placed successfully!`, 'success');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: savedOrder, error: orderError } = await client
            .from('orders')
            .insert([newOrder])
            .select()
            .single();
          if (orderError) throw orderError;

          const orderItems = (orderPayload.items || []).map((item) => ({
            order_id: savedOrder.id,
            product_id: item.id,
            product_title: item.title,
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0),
            size: item.selectedSize || null,
            color: item.selectedColor || null
          }));

          if (orderItems.length > 0) {
            const { error: itemError } = await client.from('order_items').insert(orderItems);
            if (itemError) {
              await client.from('orders').delete().eq('id', savedOrder.id);
              throw itemError;
            }
          }

          setOrders((previous) => previous.map((order) => order.id === newOrder.id ? savedOrder : order));
        } catch (e) {
          console.error('Create order error:', e);
          setOrders((previous) => previous.filter((order) => order.id !== newOrder.id));
          showToast(`Order could not be saved: ${e.message || 'Supabase error'}`, 'error');
          return null;
        }
      }
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNotes = '') => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId || ord.order_number === orderId) {
          return {
            ...ord,
            status: newStatus,
            tracking_notes: trackingNotes || ord.tracking_notes,
            updated_at: new Date().toISOString()
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${newStatus}".`);

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          await client
            .from('orders')
            .update({ status: newStatus, tracking_notes: trackingNotes, updated_at: new Date().toISOString() })
            .or(`id.eq.${orderId},order_number.eq.${orderId}`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Cart Handlers
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const size = selectedSize || product.available_sizes?.[0] || 'Standard';
    const color = selectedColor || product.colors?.[0] || 'Original';
    const cartItemId = `${product.id}-${size}-${color}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '',
          material: product.material,
          selectedSize: size,
          selectedColor: color,
          quantity
        }
      ];
    });

    showToast(`Added "${product.title}" to your Shopping Bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast(`Item removed from Shopping Bag.`, 'info');
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your Wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Wishlist.');
        return [...prev, productId];
      }
    });
  };

  // ========== REVIEWS & RATINGS ==========
  const addReview = (productId, reviewData) => {
    const newReview = {
      id: `review-${Date.now()}`,
      productId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      authorName: reviewData.authorName,
      authorEmail: reviewData.authorEmail,
      isVerifiedPurchase: reviewData.isVerifiedPurchase || false,
      helpful: 0,
      unhelpful: 0,
      created_at: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);
    showToast('Thank you for your review! It will appear after moderation.');

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          client.from('reviews').insert([newReview]).catch(e => console.error(e));
        } catch (e) {
          console.error(e);
        }
      }
    }

    return newReview;
  };

  const getProductReviews = (productId) => {
    return reviews.filter(r => r.productId === productId);
  };

  const getProductAverageRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  const updateReviewHelpful = (reviewId, type = 'helpful') => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            [type]: r[type] + 1
          };
        }
        return r;
      })
    );
  };

  // ========== COUPONS & DISCOUNTS ==========
  const validateCoupon = (couponCode) => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    const now = Date.now();
    const startsAt = coupon?.valid_from ? new Date(coupon.valid_from).getTime() : 0;
    const expiresAt = coupon?.valid_until ? new Date(coupon.valid_until).getTime() : Infinity;
    if (!coupon || !coupon.is_active || now < startsAt || now > expiresAt || (coupon.min_purchase_amount && cartSubtotal < Number(coupon.min_purchase_amount))) {
      showToast('Invalid or expired coupon code.', 'error');
      return null;
    }
    return coupon;
  };

  const applyCoupon = (couponCode) => {
    const coupon = validateCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      showToast(`Coupon "${coupon.code}" applied successfully!`);
      return coupon;
    }
    return null;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  const applyGiftCard = (giftCardCode) => {
    const giftCard = availableGiftCards.find(card => card.code.toUpperCase() === giftCardCode.toUpperCase());
    const expiresAt = giftCard?.expires_at ? new Date(giftCard.expires_at).getTime() : Infinity;
    if (!giftCard || !giftCard.is_active || Number(giftCard.balance) <= 0 || Date.now() > expiresAt) {
      showToast('Invalid, expired, or empty gift card.', 'error');
      return null;
    }
    setAppliedGiftCard(giftCard);
    showToast(`Gift card "${giftCard.code}" applied successfully!`);
    return giftCard;
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    showToast('Gift card removed.');
  };

  const calculateDiscountAmount = (subtotal) => {
    let discount = 0;
    if (appliedCoupon) {
      discount += appliedCoupon.discount_type === 'percentage'
        ? Math.round((subtotal * appliedCoupon.discount_value) / 100)
        : Number(appliedCoupon.discount_value);
    }
    if (appliedGiftCard) discount += Number(appliedGiftCard.balance);
    return Math.min(discount, subtotal);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = calculateDiscountAmount(cartSubtotal);
  const cartTotal = cartSubtotal - discountAmount;

  const categoryNames = ['All Garments', ...categories.map(c => c.name)];

  return (
    <ShopContext.Provider
      value={{
        categories,
        categoryNames,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        products,
        orders,
        cart,
        wishlist,
        reviews,
        currentUser,
        userOrders,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        currency,
        setCurrency,
        heroSlides,
        setHeroSlides,
        fetchHeroSlidesFromSupabase,
        saveHeroSlidesToSupabase,
        deleteHeroSlide,
        activeCategory,
        setActiveCategory,
        activeSubcategory,
        setActiveSubcategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        cartSubtotal,
        cartItemCount,
        cartTotal,
        addReview,
        getProductReviews,
        getProductAverageRating,
        updateReviewHelpful,
        appliedCoupon,
        appliedGiftCard,
        availableCoupons,
        applyCoupon,
        removeCoupon,
        applyGiftCard,
        removeGiftCard,
        validateCoupon,
        calculateDiscountAmount,
        discountAmount
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
