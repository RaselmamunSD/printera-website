"use client"; // Required for usePathname

import {
  Box,
  Camera,
  CreditCard,
  Edit3,
  Heart,
  HeartCrack,
  History,
  Mail,
  MapPin,
  Phone,
  Settings,
  Settings2,
  User,
} from "lucide-react";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Ad from "../components/shared/Ad";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import to detect active route
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Providers from "app/providers";
import ProtectedRoute from "routes/ProtectedRoute";


const DashboardLayout = ({ children }) => {
  const pathname = usePathname(); // Get current URL path
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [photoOverrideUrl, setPhotoOverrideUrl] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { logout } = useAuth();
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchDashboardData = useCallback(async () => {
    if (authLoading || !isAuthenticated) return;
    try {
      const response = await axios.get("/profile/dashboard/");
      setDashboardData(response.data);
    } catch {
      setDashboardData(null);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Keep dashboard header avatar in sync with edit-profile uploads.
  useEffect(() => {
    const onPreview = (e) => {
      setPhotoOverrideUrl(e?.detail?.url || null);
    };
    const onUpdated = async () => {
      // Don't clear the override until we re-fetch dashboard data,
      // otherwise avatar can temporarily drop to placeholder.
      await fetchDashboardData();
      setPhotoOverrideUrl(null);
    };

    window.addEventListener("profile_photo_preview", onPreview);
    window.addEventListener("profile_photo_updated", onUpdated);
    return () => {
      window.removeEventListener("profile_photo_preview", onPreview);
      window.removeEventListener("profile_photo_updated", onUpdated);
    };
  }, [fetchDashboardData]);

  const profile = dashboardData?.profile;
  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: dashboardData?.stats?.total_orders ?? "0",
        icon: <Box className="text-white" />,
        bgColor: "bg-blue-500",
      },
      {
        label: "Total Spent",
        value: `$${dashboardData?.stats?.total_spent ?? "0.00"}`,
        icon: <CreditCard className="text-white" />,
        bgColor: "bg-emerald-500",
      },
      {
        label: "Saved Designs",
        value: dashboardData?.stats?.saved_designs ?? "0",
        icon: <Heart className="text-white" />,
        bgColor: "bg-purple-500",
      },
      {
        label: "Active Projects",
        value: dashboardData?.stats?.active_projects ?? "0",
        icon: <Settings className="text-white" />,
        bgColor: "bg-orange-500",
      },
    ],
    [dashboardData]
  );

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: <User size={16} /> },
    {
      name: "Order History",
      path: "/dashboard/order-history",
      icon: <History size={16} />,
    },
    {
      name: "Saved Designs",
      path: "/dashboard/saved-designs",
      icon: <HeartCrack size={16} />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings2 size={16} />,
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-8 md:py-20 text-center text-sm font-semibold text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div>
        <Ad />
        <Navbar />
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-8 md:py-20 text-[#1e1e2d]">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* PROFILE HEADER CARD */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                    {photoOverrideUrl || profile?.photo_url ? (
                      // Use plain `<img>` to avoid `next/image` restrictions with private IPs.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoOverrideUrl || profile?.photo_url}
                        alt={profile?.full_name || "Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {(profile?.full_name || "U")
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((p) => p[0]?.toUpperCase())
                          .join("")}
                      </div>
                    )}
                  </div>
                  <Link
                    href={"/dashboard/settings/edit-profile"}
                    className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full border-2 border-white text-white hover:bg-blue-700 transition-colors"
                    aria-label="Edit profile photo"
                  >
                    <Camera size={14} />
                  </Link>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black">{profile?.full_name || "User"}</h2>
                  <p className="text-gray-500 font-medium text-sm md:text-base">
                    {profile?.company_name || "No company added"}
                  </p>
                  <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 text-sm text-gray-500">
                    <span className="flex items-center justify-center md:justify-start gap-1.5">
                      <Mail size={14} /> {profile?.email || "No email"}
                    </span>
                    <span className="flex items-center justify-center md:justify-start gap-1.5">
                      <Phone size={14} /> {profile?.phone || "No phone"}
                    </span>
                    <span className="flex items-center justify-center md:justify-start gap-1.5">
                      <MapPin size={14} /> {[profile?.city, profile?.state].filter(Boolean).join(", ") || "No location"}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={"/dashboard/settings/edit-profile"}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Edit3 size={18} /> Edit Profile
              </Link>
            </div>
            {/* lOG OUT Button */}
            <div className="flex justify-end">
              <button className="btn-primary font-bold" onClick={() => {
                logout();
                router.push("/");
              }}>
                Logout
              </button>
            </div>
            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-lg md:text-2xl font-black">{stat.value}</p>
                  </div>
                  <div
                    className={`${stat.bgColor} p-2 md:p-3 rounded-xl shadow-inner`}
                  >
                    {React.cloneElement(stat.icon, {
                      size: 18,
                      className: "text-white",
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* NAVIGATION TABS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-100 px-6 scrollbar-hide">
                {navItems.map((item) => {
                  // If the path is exactly '/dashboard', check for equality.
                  // Otherwise, use startsWith to catch nested routes (like settings/edit-profile).
                  const isActive =
                    item.path === "/dashboard" ?
                      pathname === "/dashboard"
                      : pathname.startsWith(item.path);

                  return (
                    <Link
                      href={item.path}
                      key={item.name}
                      className={`px-4 py-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${isActive ?
                        "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="w-full overflow-hidden p-6 md:p-8">{children}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
