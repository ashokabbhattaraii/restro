"use client";

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`toggle ${checked ? "toggle-on" : ""}`}
      onClick={() => onChange?.(!checked)}
      type="button"
    >
      <span />
      {label ? <em>{label}</em> : null}
    </button>
  );
}
