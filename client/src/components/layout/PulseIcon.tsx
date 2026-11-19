/** Heartbeat line for the logo (Heroicons has no pulse icon). */
export function PulseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M3 12h4l3-7 4 14 3-7h4" />
    </svg>
  );
}
