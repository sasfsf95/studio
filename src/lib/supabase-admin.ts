// ⚠️ SERVER ONLY — never import this in client components.
// Uses the secret key to bypass Row Level Security (RLS).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://wzhxhlqxmhrvteitkawh.supabase.co';

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aHhobHF4bWhydnRlaXRrYXdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUxNzAyOCwiZXhwIjoyMDg3MDkzMDI4fQ.wc4Q4XbtPEIQGum_h3FcLoBPmFnbu96XtlGWikDd4Fg';

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
