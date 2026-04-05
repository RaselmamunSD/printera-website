"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Bell, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

const SettingsView = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile/me/");
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          url: err.config?.url,
        });
        setProfile(null);
        setError(err.response?.data?.error || "Failed to load profile. Please try refreshing.");
      }
    };

    fetchProfile();
  }, []);

  const toggleEmailNotifications = async () => {
    if (!profile) return;
    const nextValue = !profile.email_notifications;
    setProfile({ ...profile, email_notifications: nextValue });
    try {
      await axios.patch("/profile/me/", { email_notifications: nextValue });
    } catch {
      setProfile(profile);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6">
      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 1. ACCOUNT INFORMATION SECTION */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-[#1e1e2d] uppercase tracking-wider">
          Account Information
        </h3>
        <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Full Name
              </p>
              <p className="font-bold text-[#1e1e2d]">{profile?.full_name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Email
              </p>
              <p className="font-bold text-[#1e1e2d]">{profile?.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="font-bold text-[#1e1e2d]">{profile?.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Company
              </p>
              <p className="font-bold text-[#1e1e2d]">{profile?.company_name || "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Address
              </p>
              <p className="font-bold text-[#1e1e2d]">{[profile?.address, profile?.city, profile?.state, profile?.postal_code].filter(Boolean).join(", ") || "Not provided"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PREFERENCES SECTION */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-[#1e1e2d] uppercase tracking-wider">
          Preferences
        </h3>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1e1e2d]">
                Email Notifications
              </p>
              <p className="text-xs text-gray-400">
                Receive updates about your orders
              </p>
            </div>
          </div>
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={Boolean(profile?.email_notifications)} onChange={toggleEmailNotifications} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      {/* 3. SECURITY SECTION */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-[#1e1e2d] uppercase tracking-wider">
          Security
        </h3>
        <div>
          <Link
            href={"/dashboard/settings/change-password"}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 w-[220px]"
          >
            <ShieldCheck size={18} /> Change Password
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
