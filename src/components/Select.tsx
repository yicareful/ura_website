"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "请选择",
  name,
  required,
  disabled,
  className = "",
  dark = false,
}: {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  dark?: boolean;
}) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);

  const selected = options.find((o) => o.value === value);

  const ignoreClick = useRef(false);

  const select = useCallback(
    (v: string) => {
      onChange?.(v);
      setOpen(false);
    },
    [onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        // Find the first enabled option as the initial keyboard focus target
        const firstActive = options.findIndex((o) => !o.disabled);
        setFocusIdx(firstActive >= 0 ? firstActive : -1);
        ignoreClick.current = true;
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusIdx((current) => {
          let next = current + 1;
          while (next < options.length && options[next].disabled) next++;
          return next < options.length ? next : current;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusIdx((current) => {
          let prev = current - 1;
          while (prev >= 0 && options[prev].disabled) prev--;
          return prev >= 0 ? prev : current;
        });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusIdx >= 0 && !options[focusIdx]?.disabled) {
          select(options[focusIdx].value);
        }
        ignoreClick.current = true;
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        ignoreClick.current = true;
        break;
    }
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", userSelect: "none" }}
      onKeyDown={onKeyDown}
    >
      {/* Hidden native input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value ?? ""}
        disabled={disabled}
      />

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onMouseDown={() => { ignoreClick.current = false; }}
        onClick={() => {
          if (ignoreClick.current) { ignoreClick.current = false; return; }
          setOpen((v) => !v);
          if (!open) setFocusIdx(-1);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={uid}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          minHeight: 48,
          padding: "var(--space-3) var(--space-10) var(--space-3) var(--space-4)",
          border: `2px solid ${dark ? "rgba(255,255,255,.18)" : "var(--color-border-strong)"}`,
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-body)",
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          color: dark ? (selected ? "var(--color-text-on-dark)" : "var(--color-text-on-dark-muted)") : (selected ? "var(--color-text-primary)" : "var(--color-text-muted)"),
          background: dark ? "rgba(255,255,255,.06)" : "var(--color-surface)",
          transition: "border-color var(--duration-fast) var(--ease-smooth), box-shadow var(--duration-fast) var(--ease-smooth), background var(--duration-fast) var(--ease-smooth)",
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.32)" : "var(--color-text-muted)";
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.18)" : "var(--color-border-strong)";
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = "var(--color-blue)";
            e.currentTarget.style.boxShadow = dark
              ? "0 0 0 4px rgba(21,180,198,.2)"
              : "0 0 0 4px rgba(21,180,198,.16), var(--shadow-sm)";
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.18)" : "var(--color-border-strong)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.label : placeholder}
        </span>

        {/* Arrow */}
        <svg
          width="12" height="8" viewBox="0 0 12 8" fill="none"
          style={{
            flexShrink: 0,
            transition: "transform var(--duration-fast) var(--ease-smooth)",
            transform: open ? "rotate(-180deg)" : "rotate(0deg)",
            marginLeft: "auto",
            position: "absolute",
            right: 14,
            top: "50%",
            marginTop: -4,
          }}
        >
          <path
            d="M1 1.5l5 5 5-5"
            stroke={dark ? "#aab3ac" : "#5a625c"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: dark ? "var(--color-asphalt-2)" : "var(--color-surface)",
            border: `1px solid ${dark ? "rgba(255,255,255,.12)" : "var(--color-border-strong)"}`,
            borderRadius: "var(--radius-md)",
            boxShadow: dark ? "0 16px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06)" : "var(--shadow-lg)",
            overflow: "hidden",
            animation: "slide-down 160ms var(--ease-out-expo) both",
          }}
        >
          {options.map((opt, i) => {
            const isActive = !opt.disabled;
            const isFocused = i === focusIdx;
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => isActive && select(opt.value)}
                onMouseEnter={() => setFocusIdx(i)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4) var(--space-3) var(--space-4)",
                  paddingLeft: isSelected ? "var(--space-4)" : "var(--space-4)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  cursor: isActive ? "pointer" : "not-allowed",
                  color: isSelected
                    ? (dark ? "var(--color-blue)" : "var(--color-red)")
                    : opt.disabled
                      ? "var(--color-text-muted)"
                      : (dark ? "var(--color-text-on-dark)" : "var(--color-text-primary)"),
                  background: isFocused && isActive
                    ? (dark ? "rgba(255,255,255,.06)" : "var(--color-surface-2)")
                    : "transparent",
                  fontWeight: isSelected ? 700 : 400,
                  transition: "background var(--duration-fast) var(--ease-smooth)",
                  borderLeft: isSelected ? `3px solid ${dark ? "var(--color-blue)" : "var(--color-red)"}` : "3px solid transparent",
                }}
              >
                {/* Selected checkmark */}
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{
                    flexShrink: 0,
                    opacity: isSelected ? 1 : 0,
                    transition: "opacity var(--duration-fast) var(--ease-smooth)",
                  }}
                >
                  <path
                    d="M2 7.5l3.5 3.5L12 3"
                    stroke={dark ? "var(--color-blue)" : "var(--color-red)"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ flex: 1 }}>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
