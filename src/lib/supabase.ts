import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { Progress } from "./progress";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project") &&
    supabaseUrl.startsWith("http")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export type CloudProfile = {
  user_id: string;
  xp: number;
  streak: number;
  last_active: string | null;
  quests_done: string[];
  updated_at?: string;
};

/**
 * Save user progress to Supabase user_progress table.
 */
export async function saveProgressToSupabase(
  user: User,
  progress: Progress
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase not configured in .env.local" };
  }

  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        xp: progress.xp,
        streak: progress.streak,
        last_active: progress.lastActive,
        quests_done: progress.questsDone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error("Failed to save progress to Supabase:", err);
    return { error: err instanceof Error ? err.message : "Save failed" };
  }
}

/**
 * Fetch user progress from Supabase user_progress table.
 */
export async function loadProgressFromSupabase(
  user: User
): Promise<{ progress: Progress | null; error: string | null }> {
  if (!supabase) {
    return { progress: null, error: "Supabase not configured in .env.local" };
  }

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("xp, streak, last_active, quests_done")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { progress: null, error: null };

    return {
      progress: {
        xp: data.xp ?? 0,
        streak: data.streak ?? 0,
        lastActive: data.last_active ?? null,
        questsDone: Array.isArray(data.quests_done) ? data.quests_done : [],
      },
      error: null,
    };
  } catch (err) {
    console.error("Failed to load progress from Supabase:", err);
    return {
      progress: null,
      error: err instanceof Error ? err.message : "Load failed",
    };
  }
}
