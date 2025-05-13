import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://khgjxfoprydjwqzpkxue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ2p4Zm9wcnlkandxenBreHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTMwMTEsImV4cCI6MjA2MTEyOTAxMX0.7TQKlIZi2CeTAptq9bHgDVw8pqRdCGwkHAzB_KSkNE4';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ2p4Zm9wcnlkandxenBreHVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTU1MzAxMSwiZXhwIjoyMDYxMTI5MDExfQ.8k8KT-nHkp62CgddxzZSj5MzYMMwSjcFKW7ioXOUiMs';

// Client for public operations (user authentication)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Client with service role for admin operations
// This bypasses RLS policies completely
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // Don't persist session for admin client
    autoRefreshToken: false, // Don't auto refresh for admin client
  }
});

// Helper function to get an authenticated client using the current session
// This is useful for operations that should respect RLS but need auth
export const getAuthenticatedClient = async () => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (!session) {
    console.warn('No active session found for authenticated client');
    return supabase; // Return regular client if no session
  }
  
  // Create a new client with the access token
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    }
  });
};

export default supabase;
