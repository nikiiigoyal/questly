"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

/**
 * The signed-in player's email, shared across components. The Supabase session
 * is the source of truth; localStorage mirrors it so the initials avatar also
 * appears instantly (and in demo mode), and a window event keeps every
 * useAuthUser() consumer in sync without prop-drilling.
 */

const EMAIL_KEY = "questly-email";
const AUTH_EVENT = "questly-auth-changed";

/** "satyam.goyal@gmail.com" → "SG", "questly" → "QU" */
export function initialsOf(email: string): string {
  const local = (email.split("@")[0] ?? "").trim();
  if (!local) return "?";
  const parts = local.split(/[._\-+]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

/** Deterministic brand color per email so a player always gets the same avatar. */
export function avatarColorOf(email: string): string {
  const classes = ["bg-brand", "bg-sky", "bg-fox", "bg-beetle", "bg-berry", "bg-sun-dark"];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return classes[hash % classes.length];
}

export function rememberAuthEmail(email: string): void {
  try {
    localStorage.setItem(EMAIL_KEY, email);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {
    // storage unavailable — avatar just won't persist
  }
}

export function forgetAuthEmail(): void {
  try {
    localStorage.removeItem(EMAIL_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {
    // ignore
  }
}

export function useAuthUser() {
  const [email, setEmail] = useState<string | null>(null);

  const read = useCallback(async () => {
    let value: string | null = null;
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        value = data.session?.user?.email ?? null;
      } catch {
        // fall through to localStorage
      }
    }
    if (!value) {
      try {
        value = localStorage.getItem(EMAIL_KEY);
      } catch {
        value = null;
      }
    }
    setEmail(value);
  }, []);

  useEffect(() => {
    const onChange = () => void read();
    // Deferred so the initial read never sets state synchronously in the effect.
    const initial = window.setTimeout(() => void read(), 0);
    window.addEventListener(AUTH_EVENT, onChange);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener(AUTH_EVENT, onChange);
    };
  }, [read]);

  const signOut = useCallback(async () => {
    try {
      await supabase?.auth.signOut();
    } catch {
      // session may already be gone
    }
    forgetAuthEmail();
  }, []);

  return { email, signOut };
}
