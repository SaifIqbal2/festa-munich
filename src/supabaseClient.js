import { createClient } from '@supabase/supabase-js';

// Singleton instance
let supabaseClientInstance = null;
let lastStoredUrl = null;
let lastStoredKey = null;

// Retrieve credentials from localStorage or Vite env variables
const getStoredCredentials = () => {
  const customUrl = localStorage.getItem('festa_supabase_url');
  const customKey = localStorage.getItem('festa_supabase_anon_key');

  const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://ufzsgtbaprwbpvlwxutt.supabase.co';
  const supabaseAnonKey = 
    customKey || 
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    import.meta.env.VITE_SUPABASE_ANON_KEY || 
    'sb_publishable_2GrW-bbDIj7TBANV00a-oQ_KhZjQ282';

  return { supabaseUrl, supabaseAnonKey };
};

export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getStoredCredentials();
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    supabaseUrl.includes('.supabase.co')
  );
};

export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getStoredCredentials();
  
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Return cached instance if credentials haven't changed
  if (supabaseClientInstance && lastStoredUrl === supabaseUrl && lastStoredKey === supabaseAnonKey) {
    return supabaseClientInstance;
  }

  try {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    lastStoredUrl = supabaseUrl;
    lastStoredKey = supabaseAnonKey;
    return supabaseClientInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const saveSupabaseCredentials = (url, key) => {
  if (url) localStorage.setItem('festa_supabase_url', url.trim());
  else localStorage.removeItem('festa_supabase_url');

  if (key) localStorage.setItem('festa_supabase_anon_key', key.trim());
  else localStorage.removeItem('festa_supabase_anon_key');

  // Reset cache to force client recreation with new credentials
  supabaseClientInstance = null;
  lastStoredUrl = null;
  lastStoredKey = null;
};

export const getSavedSupabaseConfig = () => {
  const { supabaseUrl, supabaseAnonKey } = getStoredCredentials();
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
    isConfigured: isSupabaseConfigured()
  };
};

// Direct export for standard usage
export const supabase = getSupabaseClient();
