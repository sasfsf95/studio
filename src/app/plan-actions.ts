'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export interface UserPlanData {
  id: number;
  user_id: number;
  premium_plan: number;
  premium_expires_at: string | null;
  monthly_message_limit: number;
  created_at?: string;
}

export interface QuotaDeductResult {
  allowed: boolean;
  isPremium: boolean;
  messagesLeft: number | null;
  plan?: UserPlanData | null;
  error?: string;
}

/**
 * Get or create the user plan for a given user_id.
 * If user_plan doesn't exist, defaults to:
 * premium_plan: 0 (free), monthly_message_limit: 30.
 */
export async function getUserPlan(userId: number): Promise<UserPlanData | null> {
  if (!userId) return null;

  try {
    const { data: existingPlan, error: fetchError } = await supabaseAdmin
      .from('user_plan')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching user_plan for user_id:', userId, fetchError);
      return null;
    }

    if (existingPlan) {
      return {
        id: existingPlan.id,
        user_id: existingPlan.user_id,
        premium_plan: Number(existingPlan.premium_plan ?? 0),
        premium_expires_at: existingPlan.premium_expires_at,
        monthly_message_limit: Number(existingPlan.monthly_message_limit ?? 25),
        created_at: existingPlan.created_at,
      };
    }

    // Default to free plan: premium_plan = 0, 25 monthly message limit
    const { data: newPlan, error: insertError } = await supabaseAdmin
      .from('user_plan')
      .insert([
        {
          user_id: userId,
          premium_plan: 0,
          monthly_message_limit: 25,
          premium_expires_at: null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting initial user_plan for user_id:', userId, insertError);
      return null;
    }

    return {
      id: newPlan.id,
      user_id: newPlan.user_id,
      premium_plan: Number(newPlan.premium_plan ?? 0),
      premium_expires_at: newPlan.premium_expires_at,
      monthly_message_limit: Number(newPlan.monthly_message_limit ?? 30),
      created_at: newPlan.created_at,
    };
  } catch (err) {
    console.error('getUserPlan error:', err);
    return null;
  }
}

/**
 * Deduct 1 message for a user.
 * - If user is premium (premium_plan > 0 and not expired), allow unlimited messages.
 * - If user is free (premium_plan === 0), decrement monthly_message_limit by 1 in supabase.
 * - When monthly_message_limit <= 0, return allowed = false with error "Free limit completed please get premium".
 */
export async function useUserChatMessage(userId: number): Promise<QuotaDeductResult> {
  if (!userId) {
    return {
      allowed: false,
      isPremium: false,
      messagesLeft: 0,
      error: 'User not authenticated',
    };
  }

  const plan = await getUserPlan(userId);
  if (!plan) {
    return {
      allowed: false,
      isPremium: false,
      messagesLeft: 0,
      error: 'Unable to load user plan',
    };
  }

  // Check if premium
  const hasActivePremium = plan.premium_plan > 0 && (
    !plan.premium_expires_at || new Date(plan.premium_expires_at).getTime() > Date.now()
  );

  if (hasActivePremium) {
    return {
      allowed: true,
      isPremium: true,
      messagesLeft: null,
      plan,
    };
  }

  // Free plan checks: 30 messages limit
  const currentLimit = Number(plan.monthly_message_limit ?? 25);

  if (currentLimit <= 0) {
    return {
      allowed: false,
      isPremium: false,
      messagesLeft: 0,
      error: 'Free limit completed please get premium',
      plan,
    };
  }

  // Decrement limit by 1
  const updatedLimit = Math.max(0, currentLimit - 1);

  const { data: updatedPlan, error: updateError } = await supabaseAdmin
    .from('user_plan')
    .update({ monthly_message_limit: updatedLimit })
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating user_plan monthly_message_limit:', updateError);
    return {
      allowed: true,
      isPremium: false,
      messagesLeft: updatedLimit,
      plan: {
        ...plan,
        monthly_message_limit: updatedLimit,
      },
    };
  }

  return {
    allowed: true,
    isPremium: false,
    messagesLeft: Number(updatedPlan.monthly_message_limit),
    plan: {
      id: updatedPlan.id,
      user_id: updatedPlan.user_id,
      premium_plan: Number(updatedPlan.premium_plan ?? 0),
      premium_expires_at: updatedPlan.premium_expires_at,
      monthly_message_limit: Number(updatedPlan.monthly_message_limit),
      created_at: updatedPlan.created_at,
    },
  };
}

/**
 * Updates a user's plan when they upgrade or subscribe
 */
export async function updateUserPlanPremium(
  userId: number,
  premiumPlanTier: number = 1,
  expiresAt: string | null = null
): Promise<UserPlanData | null> {
  if (!userId) return null;

  const { data: updated, error } = await supabaseAdmin
    .from('user_plan')
    .update({
      premium_plan: premiumPlanTier,
      premium_expires_at: expiresAt,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error upgrading user_plan:', error);
    return null;
  }

  return {
    id: updated.id,
    user_id: updated.user_id,
    premium_plan: Number(updated.premium_plan ?? 0),
    premium_expires_at: updated.premium_expires_at,
    monthly_message_limit: Number(updated.monthly_message_limit ?? 30),
    created_at: updated.created_at,
  };
}
