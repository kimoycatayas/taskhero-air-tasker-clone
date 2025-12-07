"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { PAGE_ROUTES } from "@/src/constants/page-routes";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push(PAGE_ROUTES.home);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-[#1565C0] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={PAGE_ROUTES.home} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="TaskHero Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-2xl font-bold">TaskHero</span>
        </Link>

        <nav className="flex gap-6 items-center">
          <Link href={PAGE_ROUTES.tasks} className="hover:text-[#FDB913] transition">
            Browse Tasks
          </Link>

          {user ? (
            <>
              <Link href={PAGE_ROUTES.dashboard} className="hover:text-[#FDB913] transition">
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:text-[#FDB913] transition"
                >
                  <div className="w-8 h-8 bg-[#FDB913] rounded-full flex items-center justify-center text-[#1565C0] font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={PAGE_ROUTES.login}
                className="hover:text-[#FDB913] transition"
              >
                Login
              </Link>
              <Link
                href={PAGE_ROUTES.signup}
                className="px-4 py-2 bg-[#FDB913] text-[#1565C0] rounded-md hover:bg-[#E5A812] transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
