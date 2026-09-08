import { ButtonHTMLAttributes } from "react";

type Variant = "green" | "blue" | "red" | "sun" | "white";

const variants: Record<Variant, string> = {
  green: "bg-brand border-brand-dark text-white",
  blue: "bg-sky border-sky-dark text-white",
  red: "bg-berry border-berry-dark text-white",
  sun: "bg-sun border-sun-dark text-white",
  white: "bg-white border-gray-200 text-foreground",
};

/** Duolingo-style chunky button: thick bottom border that collapses on press. */
export default function ChunkyButton({
  variant = "green",
  className = "",
  ...props
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`select-none rounded-2xl border-b-4 px-6 py-3.5 text-center font-bold uppercase tracking-wider transition-all duration-100 hover:brightness-105 active:translate-y-[2px] active:border-b-0 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    />
  );
}
