"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const access = params.get("access");
        const refresh = params.get("refresh");
        const user = params.get("user");
        const authError = params.get("error");

        if (authError) {
            setError("Google login failed. Please try again.");
            return;
        }

        if (!access || !refresh || !user) {
            setError("Google login response is incomplete. Please try again.");
            return;
        }

        let parsedUser = null;
        if (user) {
            try {
                parsedUser = JSON.parse(decodeURIComponent(user));
            } catch {
                try {
                    parsedUser = JSON.parse(user);
                } catch {
                    parsedUser = user;
                }
            }
        }

        try {
            login({ access, refresh, user: parsedUser });
            router.replace("/");
        } catch {
            setError("Unable to complete Google login. Please try again.");
        }
    }, [login, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-black text-[#1e1e2d]">
                    {error ? "Google Login Failed" : "Signing you in"}
                </h1>
                <p className="mt-3 text-sm font-medium text-gray-500">
                    {error || "Please wait while we complete your Google login."}
                </p>
                {error && (
                    <button
                        type="button"
                        onClick={() => router.replace("/login")}
                        className="mt-6 rounded-xl bg-[#EE2A24] px-5 py-3 font-bold text-white transition-all hover:bg-[#d6221c]"
                    >
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
}
