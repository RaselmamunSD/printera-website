"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Heart, RefreshCw } from "lucide-react";
import axios from "@/lib/axios";

const SavedDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get("/account/saved-designs/");
        setDesigns(Array.isArray(response.data) ? response.data : []);
      } catch {
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const toggleFavorite = async (design) => {
    const nextValue = !design.is_favorite;
    setDesigns((prev) => prev.map((item) => item.id === design.id ? { ...item, is_favorite: nextValue } : item));
    try {
      await axios.patch(`/account/saved-designs/${design.id}/`, { is_favorite: nextValue });
    } catch {
      setDesigns((prev) => prev.map((item) => item.id === design.id ? { ...item, is_favorite: design.is_favorite } : item));
    }
  };

  const statusColor = (status) => ({
    draft: "bg-slate-50 text-slate-600",
    production: "bg-amber-50 text-amber-600",
    delivered: "bg-emerald-50 text-emerald-600",
  }[status] || "bg-slate-50 text-slate-600");

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-lg font-black text-[#1e1e2d] tracking-tight">
          Custom Designs History
        </h2>
        <p className="text-xs font-medium text-gray-400">
          Designs you've customized and ordered
        </p>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => <div key={index} className="h-[340px] animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : designs.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm font-medium text-gray-500">
          No saved designs yet.
        </div>
      ) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100">
              <img
                src={design.preview_image_url || "/api/placeholder/400/200"}
                alt={design.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-[#1e1e2d] leading-tight">
                  {design.title}
                </h3>
                <p className="text-xs font-medium text-gray-500">
                  {design.category}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                  Ordered: {new Date(design.created_at).toLocaleDateString()}
                </p>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${statusColor(design.status)}`}
                >
                  {design.status_display || design.status}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-[#2563eb] text-white py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw size={14} /> Reorder / Modify
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(design)}
                  className={`p-2.5 rounded-xl border transition-colors ${design.is_favorite ? "bg-red-50 border-red-100 text-red-500" : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500"}`}
                >
                  <Heart
                    size={18}
                    fill={design.is_favorite ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default SavedDesigns;
