"use client";
import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function ForgotPasswordFlow() {
  const router = useRouter();
  // States: 'request' | 'check-email' | 'reset' | 'success'
  const [step, setStep] = useState("request");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailValue = e.target.email.value;
    setEmail(emailValue);

    try {
      await axios.post("/auth/forgot-password/", {
        email: emailValue,
      });
      setStep("check-email");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newPassword = e.target.new_password.value;
    const confirmPassword = e.target.confirm_password.value;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, you would include a reset token here
      await axios.post("/auth/reset-password/", {
        email,
        new_password: newPassword,
      });
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (e, nextStep) => {
    e?.preventDefault();
    setStep(nextStep);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-8 py-12 flex flex-col justify-center min-h-full">
      {/* STEP 1: REQUEST RESET */}
      {step === "request" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#1e1e2d] tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Enter your email address and we will send you a reset link.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleRequestReset}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EE2A24] transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl outline-none focus:border-[#EE2A24] transition-all font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE2A24] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-[#d6221c] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 w-full"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      )}

      {/* STEP 2: CHECK EMAIL */}
      {step === "check-email" && (
        <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="bg-red-50 p-5 rounded-full ring-8 ring-red-50/50">
              <Mail className="text-[#EE2A24]" size={36} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#1e1e2d]">
              Check Your Email
            </h1>
            <p className="text-gray-500 text-sm">
              We have sent a password reset link to <br />
              <span className="font-bold text-gray-900">
                {email}
              </span>
            </p>
          </div>
          <button
            onClick={(e) => handleNext(e, "reset")}
            className="w-full bg-[#EE2A24] text-white py-4 rounded-xl font-bold hover:bg-[#d6221c] transition-all shadow-lg shadow-red-100"
          >
            Open Reset Link
          </button>
          <p className="text-sm text-gray-400 font-medium">
            Did not receive the email?{" "}
            <button
              onClick={() => setStep("request")}
              className="text-[#EE2A24] font-bold hover:underline"
            >
              Resend
            </button>
          </p>
        </div>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === "reset" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#1e1e2d]">
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={handleResetPassword}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                New Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EE2A24] transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  required
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-100 rounded-xl outline-none focus:border-[#EE2A24] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ?
                    <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                Must be at least 8 characters.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Confirm New Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EE2A24] transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  required
                  name="confirm_password"
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl outline-none focus:border-[#EE2A24] transition-all font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE2A24] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-[#d6221c] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === "success" && (
        <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="bg-green-50 p-5 rounded-full ring-8 ring-green-50/50">
              <CheckCircle2 className="text-green-500" size={36} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#1e1e2d]">
              Password Reset Successful!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </div>
          <Link
            href="/login"
            className="block w-full bg-[#EE2A24] text-white py-4 rounded-xl font-bold hover:bg-[#d6221c] transition-all shadow-lg shadow-red-100"
          >
            Continue to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

