"use client";

import { useForm } from "react-hook-form";
import { register as registerUser } from "../services/authService";
import type { RegisterRequest } from "../types/auth";
import GenderSelect from "../components/GenderSelect";

export default function RegisterForm() {
  const { register, handleSubmit, reset } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data);
      alert("Success");
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Name"
        {...register("username")}
      />

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
      />

      <input
        type="password"
        placeholder="Confirm Password"
      />

      {/* Gender — combo box, wired into shared form state */}
      <GenderSelect
        value={form.gender}
        onChange={(val) => setForm((prev) => ({...prev, gender:val}))}
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}