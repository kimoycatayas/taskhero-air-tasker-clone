"use client";
import { Api } from "@/src/api/auth";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [loginData, setLoginData] = useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });

  function emailOnChange(e: ChangeEvent<HTMLInputElement>) {
    setLoginData((prev) => ({ ...prev, email: e.target.value }));
  }

  function passwordOnChange(e: ChangeEvent<HTMLInputElement>) {
    setLoginData((prev) => ({ ...prev, password: e.target.value }));
  }

  function handleLogin(e: MouseEventHandler<HTMLButtonElement>) {
    Api.LoginUser(loginData);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="TaskHero Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-[#1565C0] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your TaskHero account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:border-[#1565C0] focus:outline-none"
              placeholder="Enter your email"
              onChange={emailOnChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:border-[#1565C0] focus:outline-none"
              placeholder="Enter your password"
              onChange={passwordOnChange}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-[#1565C0] text-white font-semibold py-3 rounded-md hover:bg-[#0D47A1] transition"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href={PAGE_ROUTES.signup}
              className="text-[#1565C0] font-semibold hover:text-[#FDB913]"
            >
              Sign Up Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
