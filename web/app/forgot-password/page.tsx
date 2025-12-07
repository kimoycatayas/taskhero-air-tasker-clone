"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/contexts/AuthContext";
import { PAGE_ROUTES } from "@/src/constants/page-routes";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-[#1565C0] mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {success
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
            If an account exists with this email, a password reset link has been sent. Please check
            your inbox and spam folder.
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:border-[#1565C0] focus:outline-none text-gray-900"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1565C0] text-white font-semibold py-3 rounded-md hover:bg-[#0D47A1] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-200 transition"
            >
              Send Another Email
            </button>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link href={PAGE_ROUTES.login} className="text-[#1565C0] font-semibold hover:text-[#FDB913]">
              Login Here
            </Link>
          </p>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href={PAGE_ROUTES.signup} className="text-[#1565C0] font-semibold hover:text-[#FDB913]">
              Sign Up Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

