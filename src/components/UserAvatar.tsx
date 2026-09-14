"use client";

import { avatarColorOf, initialsOf } from "@/lib/authUser";

/** Colored circle with the player's email initials, e.g. "SG". */
export default function UserAvatar({
  email,
  className = "h-8 w-8 text-xs",
}: {
  email: string;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-xs ${avatarColorOf(email)} ${className}`}
      aria-label={`Signed in as ${email}`}
    >
      {initialsOf(email)}
    </span>
  );
}
