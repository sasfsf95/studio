'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getUserPlan, UserPlanData } from '@/app/plan-actions';

export type { UserPlanData };

export interface LoginResult {
  success: boolean;
  user?: {
    id: number;
    username: string | null;
    mobile_number: number | null;
  };
  plan?: UserPlanData | null;
  isNewUser?: boolean;
  error?: string;
  errorCode?: string;
}

export interface SendOtpResult {
  success: boolean;
  otp?: string; // returned only in dev/mock mode — remove in production
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user?: {
    id: number;
    username: string | null;
    mobile_number: number | null;
  };
  plan?: UserPlanData | null;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Generates a 6-digit OTP, stores it in `otp_sessions` with a 10-minute expiry,
 * and returns it (dev/mock mode — display on screen).
 * In production, replace the return of `otp` with an SMS/WhatsApp send.
 */
export async function sendOtp(
  mobileNumber: number
): Promise<SendOtpResult> {
  if (!mobileNumber) {
    return { success: false, error: 'Mobile number is required.' };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  // Delete any existing OTP sessions for this number
  await supabaseAdmin
    .from('otp_sessions')
    .delete()
    .eq('mobile_number', mobileNumber);

  // Insert new OTP session
  const { error: insertError } = await supabaseAdmin
    .from('otp_sessions')
    .insert([{ mobile_number: mobileNumber, otp, expires_at: expiresAt }]);

  if (insertError) {
    console.error('OTP insert error:', insertError);
    return { success: false, error: 'Failed to generate OTP. Please try again.' };
  }

  // 🔧 DEV/MOCK MODE: Return OTP to display on screen.
  // ⚠️  In production, remove the `otp` field and send via SMS here.
  return { success: true, otp };
}

/**
 * Verifies the OTP entered by the user.
 * On success, looks up the user by mobile number (auto-registers if not found).
 */
export async function verifyOtpAndLogin(
  username: string,
  mobileNumber: number,
  otp: string
): Promise<VerifyOtpResult> {
  if (!mobileNumber || !otp) {
    return { success: false, error: 'Mobile number and OTP are required.' };
  }

  // 1. Look up OTP session
  const { data: session, error: fetchError } = await supabaseAdmin
    .from('otp_sessions')
    .select('*')
    .eq('mobile_number', mobileNumber)
    .eq('otp', otp)
    .single();

  if (fetchError || !session) {
    return { success: false, error: 'Invalid OTP. Please check and try again.' };
  }

  // 2. Check expiry
  if (new Date(session.expires_at) < new Date()) {
    // Clean up expired session
    await supabaseAdmin.from('otp_sessions').delete().eq('id', session.id);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  // 3. OTP is valid — delete session
  await supabaseAdmin.from('otp_sessions').delete().eq('id', session.id);

  // 4. Look up existing user by mobile number
  const { data: existing, error: userFetchError } = await supabaseAdmin
    .from('User data')
    .select('*')
    .eq('mobile_number', mobileNumber);

  if (userFetchError) {
    return { success: false, error: userFetchError.message };
  }

  if (existing && existing.length > 0) {
    // ✅ Existing user — login
    const dbUser = existing[0];
    const plan = await getUserPlan(dbUser.id);
    return {
      success: true,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        mobile_number: dbUser.mobile_number,
      },
      plan,
      isNewUser: false,
    };
  }

  // 5. New user — auto-register with the name provided
  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('User data')
    .insert([{ username, mobile_number: mobileNumber }])
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  const plan = await getUserPlan(newUser.id);

  return {
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      mobile_number: newUser.mobile_number,
    },
    plan,
    isNewUser: true,
  };
}

/**
 * Legacy password-based login (kept for backward compatibility).
 * @deprecated Use sendOtp + verifyOtpAndLogin instead.
 */
export async function loginUser(
  username: string,
  password: string,
  mobileNumber: number
): Promise<LoginResult> {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('User data')
    .select('*')
    .eq('mobile_number', mobileNumber)
    .eq('password', password);

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (existing && existing.length > 0) {
    const dbUser = existing[0];
    const plan = await getUserPlan(dbUser.id);
    return {
      success: true,
      user: { id: dbUser.id, username: dbUser.username, mobile_number: dbUser.mobile_number },
      plan,
      isNewUser: false,
    };
  }

  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('User data')
    .insert([{ username, password, mobile_number: mobileNumber }])
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        error: 'This password is already linked to another account.',
        errorCode: '23505',
      };
    }
    return { success: false, error: insertError.message };
  }

  const plan = await getUserPlan(newUser.id);
  return {
    success: true,
    user: { id: newUser.id, username: newUser.username, mobile_number: newUser.mobile_number },
    plan,
    isNewUser: true,
  };
}

/**
 * Signup: create a new user in the database and initialize their user_plan.
 */
export async function signupUser(
  username: string,
  password: string,
  mobileNumber: number
): Promise<LoginResult> {
  const { data: existing, error: checkError } = await supabaseAdmin
    .from('User data')
    .select('id')
    .eq('mobile_number', mobileNumber);

  if (checkError) {
    return { success: false, error: checkError.message };
  }

  if (existing && existing.length > 0) {
    return {
      success: false,
      error: 'This mobile number is already registered. Please log in instead.',
      errorCode: 'DUPLICATE_MOBILE',
    };
  }

  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('User data')
    .insert([{ username, password, mobile_number: mobileNumber }])
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        error: 'This password is already in use. Please choose a different password.',
        errorCode: '23505',
      };
    }
    return { success: false, error: insertError.message };
  }

  const plan = await getUserPlan(newUser.id);

  return {
    success: true,
    user: { id: newUser.id, username: newUser.username, mobile_number: newUser.mobile_number },
    plan,
    isNewUser: true,
  };
}
