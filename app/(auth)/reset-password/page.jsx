"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isValidLink, setIsValidLink] = useState(true);

    // Get token and uid from URL
    const token = searchParams.get("token");
    const uid = searchParams.get("uid");

    useEffect(() => {
        // Check if token and uid exist in URL
        if (!token || !uid) {
            setIsValidLink(false);
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token, uid]);

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
            // Decode the uid from base64 to get email
            // Note: In a real app, you might want to store the email in the token
            // For now, we'll need to get the email from the user or use a different approach

            // Actually, let's send the uid and token directly
            // The backend will handle decoding the uid
            await axios.post("/auth/reset-password/", {
                token,
                uid,
                new_password: newPassword,
                // We need email too - let's extract from a different approach
                // For now, let's update the backend to not require email when we have uid
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // If link is invalid
    if (!isValidLink) {
        return (
            <div className="w-full max-w-[440px] mx-auto px-8 py-12 flex flex-col justify-center min-h-full">
                <div className="text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-red-50 p-5 rounded-full">
                            <Lock className="text-[#EE2A24]" size={36} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-[#1e2d]">
                            Invalid Link
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {error || "This password reset link is invalid or has expired."}
                        </p>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="block w-full bg-[#EE2A24] text-white py-4 rounded-xl font-bold hover:bg-[#d6221c] transition-all"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    // If successful
    if (success) {
        return (
            <div className="w-full max-w-[440px] mx-auto px-8 py-12 flex flex-col justify-center min-h-full">
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
            </div>
        );
    }

    return (
        <div className="w-full max-w-[440px] mx-auto px-8 py-12 flex flex-col justify-center min-h-full">
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
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 w-full"
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-[440px] mx-auto px-8 py-12 flex flex-col justify-center min-h-full">
                <div className="text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}

