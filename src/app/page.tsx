"use client"

import { getAllBreedNames, login } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "../../types";
import toast from "react-hot-toast";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const checkValidCookie = async () => {
      try {
        const response = await getAllBreedNames();
        if (response.ok) {
          router.replace('/search');
          setPageLoading(false);
        } else {
          setPageLoading(false);
        }
      } catch (error) {
        setPageLoading(false);
      }
    };

    checkValidCookie();
  }, []);

  const onSubmit = async (data: LoginInput) => {
    const toastId = toast.loading("Logging in...");
    try {
      const response = await login(data)
      if (response.ok) {
        router.push("/search");
        toast.success("Login successful!", { id: toastId });
      } else {
        toast.error("Login failed!", { id: toastId });
      }
    } catch (error) {
      toast.error("Login failed!", { id: toastId });
    }
  };

  if (pageLoading) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <p>Loading....</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer">Login</button>
      </form>
    </div>
  );
} 
