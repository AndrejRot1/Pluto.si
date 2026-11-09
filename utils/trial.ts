export const TRIAL_HELPS_LIMIT = 10;

export type TrialProfile = {
  subscription_status?: string | null;
  trial_helps_used?: number | null;
};

export function trialHelpsUsed(profile?: TrialProfile | null): number {
  const used = profile?.trial_helps_used;
  if (typeof used !== "number" || Number.isNaN(used) || used < 0) return 0;
  return used;
}

export function remainingHelps(profile?: TrialProfile | null): number {
  return Math.max(0, TRIAL_HELPS_LIMIT - trialHelpsUsed(profile));
}

export function isTrialExhausted(profile?: TrialProfile | null): boolean {
  if (!profile) return false;
  if (profile.subscription_status === "expired") return true;
  if (profile.subscription_status === "trial") {
    return trialHelpsUsed(profile) >= TRIAL_HELPS_LIMIT;
  }
  return false;
}

export function canUseHelp(profile?: TrialProfile | null): boolean {
  if (!profile) return false;
  if (profile.subscription_status === "active") return true;
  if (profile.subscription_status === "trial") {
    return trialHelpsUsed(profile) < TRIAL_HELPS_LIMIT;
  }
  return false;
}

export function trialPayload(profile?: TrialProfile | null) {
  const used = trialHelpsUsed(profile);
  return {
    used,
    limit: TRIAL_HELPS_LIMIT,
    remaining: Math.max(0, TRIAL_HELPS_LIMIT - used),
  };
}
