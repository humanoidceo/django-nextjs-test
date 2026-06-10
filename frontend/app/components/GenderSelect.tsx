"use client";
import SearchableComboBox, { ComboBoxOption } from "./SearchableComboBox";

type Gender = "M" | "F" | "O" | "";

const GENDER_OPTIONS: ComboBoxOption<Gender>[] = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
];

interface GenderSelectProps {
  value: Gender;
  onChange: (val: Gender) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <SearchableComboBox<Gender>
      id="gender"
      label="Gender"
      options={GENDER_OPTIONS}
      value={value}
      onChange={(val) => onChange(val as Gender)}
      placeholder="Search or select…"
      clearable
      clearLabel="Prefer not to say"
    />
  );
}