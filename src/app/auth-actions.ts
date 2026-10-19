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
    email?: string | null;
  };
  plan?: UserPlanData | null;
  isNewUser?: boolean;
  error?: string;
  errorCode?: string;
}

/**
 * Login: look up user by mobile_number + password.
 * If not found, auto-registers them (first-time login = signup).
 * Email is optional — saved on first registration if provided.
 */
export async function loginUser(
  username: string,
  password: string,
  mobileNumber: number,
  email?: string
): Promise<LoginResult> {
  // 1. Look up existing user by mobile + password
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('User data')
    .select('*')
    .eq('mobile_number', mobileNumber)
    .eq('password', password);

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (existing && existing.length > 0) {
    // ✅ Found — login successful
    const dbUser = existing[0];

    // Update email if it wasn't saved before and user provided one now
    if (email && !dbUser.email) {
      await supabaseAdmin
        .from('User data')
        .update({ email })
        .eq('id', dbUser.id);
    }

    const plan = await getUserPlan(dbUser.id);
    return {
      success: true,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        mobile_number: dbUser.mobile_number,
        email: email || dbUser.email || null,
      },
      plan,
      isNewUser: false,
    };
  }

  // 2. Not found — auto-register
  const insertPayload: Record<string, any> = {
    username,
    password,
    mobile_number: mobileNumber,
  };
  if (email) insertPayload.email = email;

  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('User data')
    .insert([insertPayload])
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        error: 'This mobile number or password is already linked to another account.',
        errorCode: '23505',
      };
    }
    return { success: false, error: insertError.message };
  }

  const plan = await getUserPlan(newUser.id);

  return {
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      mobile_number: newUser.mobile_number,
      email: newUser.email || null,
    },
    plan,
    isNewUser: true,
  };
}

/**
 * Signup: create a new user in the database and initialize their user_plan.
 * Email is optional.
 */
export async function signupUser(
  username: string,
  password: string,
  mobileNumber: number,
  email?: string
): Promise<LoginResult> {
  // 1. Check for duplicate mobile
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

  // 2. Insert new user
  const insertPayload: Record<string, any> = { username, password, mobile_number: mobileNumber };
  if (email) insertPayload.email = email;

  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('User data')
    .insert([insertPayload])
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
    user: {
      id: newUser.id,
      username: newUser.username,
      mobile_number: newUser.mobile_number,
      email: newUser.email || null,
    },
    plan,
    isNewUser: true,
  };
}
