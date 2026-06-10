"use client";
import { useState, useRef, useEffect, useId, KeyboardEvent } from "react";

export interface ComboBoxOption<T extends string = string> {
  value: T;
  label: string;
}

interface SearchableComboBoxProps<T extends string = string> {
  options: ComboBoxOption<T>[];
  value: T | "";
  onChange: (value: T | "") => void;
  placeholder?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
  /** Show a "clear" option in the dropdown (emits "") */
  clearable?: boolean;
  clearLabel?: string;
}

export default function SearchableComboBox<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "Search…",
  label,
  id: externalId,
  disabled = false,
  clearable = false,
  clearLabel = "— None —",
}: SearchableComboBoxProps<T>) {
  const autoId = useId();
  const inputId = externalId ?? autoId;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Derive display value for the input
  const selectedLabel =
    options.find((o) => o.value === value)?.label ??
    (value === "" && clearable ? clearLabel : "");

  // Filtered list based on query
  const baseOptions: ComboBoxOption<T | "">[] = clearable
    ? [{ value: "" as T | "", label: clearLabel }, ...options]
    : options;

  const filtered = query.trim()
    ? baseOptions.filter((o) =>
        o.label.toLowerCase().includes(query.trim().toLowerCase())
      )
    : baseOptions;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const openDropdown = () => {
    if (!disabled) {
      setOpen(true);
      setQuery("");
      setHighlighted(-1);
    }
  };

  const selectOption = (opt: ComboBoxOption<T | "">) => {
    onChange(opt.value as T | "");
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown") openDropdown();
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) {
          selectOption(filtered[highlighted] as ComboBoxOption<T | "">);
        }
        break;
      case "Escape":
        setOpen(false);
        setQuery("");
        break;
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #D1D5DB",
          borderRadius: "6px",
          background: disabled ? "#F9FAFB" : "#fff",
          cursor: disabled ? "not-allowed" : "text",
          boxShadow: open ? "0 0 0 2px #6366F1" : "none",
          transition: "box-shadow 0.15s",
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          aria-activedescendant={
            highlighted >= 0 ? `${inputId}-opt-${highlighted}` : undefined
          }
          autoComplete="off"
          disabled={disabled}
          placeholder={open ? "Type to search…" : (selectedLabel || placeholder)}
          value={open ? query : selectedLabel}
          onFocus={openDropdown}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(-1);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "8px 10px",
            fontSize: "0.9375rem",
            background: "transparent",
            cursor: disabled ? "not-allowed" : "text",
            color: open ? "#111827" : value !== "" ? "#111827" : "#9CA3AF",
          }}
        />

        {/* Chevron */}
        <span
          aria-hidden
          onClick={() => (open ? setOpen(false) : openDropdown())}
          style={{
            padding: "0 10px",
            cursor: disabled ? "not-allowed" : "pointer",
            color: "#9CA3AF",
            fontSize: "0.75rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            userSelect: "none",
          }}
        >
          ▾
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={`${inputId}-listbox`}
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            maxHeight: "220px",
            overflowY: "auto",
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
          }}
        >
          {filtered.length === 0 ? (
            <li
              style={{
                padding: "10px 14px",
                color: "#9CA3AF",
                fontSize: "0.875rem",
                fontStyle: "italic",
              }}
            >
              No results for "{query}"
            </li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHighlighted = i === highlighted;
              return (
                <li
                  key={opt.value === "" ? "__clear__" : opt.value}
                  id={`${inputId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent input blur before click registers
                    selectOption(opt as ComboBoxOption<T | "">);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  style={{
                    padding: "9px 14px",
                    fontSize: "0.9375rem",
                    cursor: "pointer",
                    background: isHighlighted
                      ? "#EEF2FF"
                      : isSelected
                      ? "#F5F3FF"
                      : "transparent",
                    color: isSelected ? "#4F46E5" : "#111827",
                    fontWeight: isSelected ? 600 : 400,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isSelected && (
                    <span aria-hidden style={{ fontSize: "0.75rem" }}>
                      ✓
                    </span>
                  )}
                  {!isSelected && (
                    <span style={{ width: "1em", display: "inline-block" }} />
                  )}
                  {opt.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}