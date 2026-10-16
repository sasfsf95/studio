import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type matching the "User data" table schema
export interface UserData {
  id?: number;
  username: string | null;
  password: string;
  mobile_number: number | null;
  created_at?: string;
}

// Type matching the "user_plan" table schema
export interface UserPlan {
  id: number;
  premium_plan: number | null;
  premium_expires_at: string | null;
  monthly_message_limit: number | null;
  created_at: string;
  user_id: number | null;
}

