import type { IApplicationRepository } from './IApplicationRepository';
import { MockRepository } from './MockRepository';
import { SupabaseRepository } from './SupabaseRepository';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

// Shared mock instance
const mockRepo = new MockRepository();
const supabaseRepo = new SupabaseRepository();

// Global app state checker for Demo mode
// This normally comes from Context, but for a simple factory we can check a demo cookie/storage.
// Since Demo mode might not have an active user, we will fallback to MockRepository.
export const getApplicationRepository = async (): Promise<IApplicationRepository> => {
  const isDemoMode = localStorage.getItem('maha_demo_mode') === 'true';
  
  if (isDemoMode) {
    return mockRepo;
  }

  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please add environment variables.");
  }

  const { data: { session } } = await supabase!.auth.getSession();
  if (!session) {
    throw new Error("User is not authenticated. Please log in.");
  }

  return supabaseRepo;
};
