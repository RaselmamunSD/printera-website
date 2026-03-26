"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import axios from "@/lib/axios";

const EditProfileForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const photoObjectUrlRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile/me/");
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          company_name: response.data.company_name || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          postal_code: response.data.postal_code || "",
        });
      } catch {
        // keep defaults
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);

    // Preview the chosen image immediately in the dashboard header.
    if (photoObjectUrlRef.current) {
      URL.revokeObjectURL(photoObjectUrlRef.current);
      photoObjectUrlRef.current = null;
    }
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      photoObjectUrlRef.current = objectUrl;
      window.dispatchEvent(
        new CustomEvent("profile_photo_preview", {
          detail: { url: objectUrl },
        })
      );
    } else {
      window.dispatchEvent(new CustomEvent("profile_photo_preview", { detail: { url: null } }));
    }
  };

  useEffect(() => {
    return () => {
      if (photoObjectUrlRef.current) {
        URL.revokeObjectURL(photoObjectUrlRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (photoFile) {
        const payload = new FormData();
        payload.append("photo", photoFile);
          // Only send photo (and any non-empty fields) so DRF validation doesn't fail
          // due to empty strings in optional inputs.
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              payload.append(key, value);
            }
          });

        const res = await axios.patch("/profile/me/", payload);
        const serverPhotoUrl = res?.data?.photo_url || null;
        // If server returns photo_url, update header immediately to avoid temporary drop.
        if (serverPhotoUrl) {
          window.dispatchEvent(
            new CustomEvent("profile_photo_preview", {
              detail: { url: serverPhotoUrl },
            })
          );
        }
      } else {
        await axios.patch("/profile/me/", formData);
      }
      setMessage("Profile updated successfully.");

      // Trigger layout to re-fetch dashboard profile (and clear preview override).
      window.dispatchEvent(new CustomEvent("profile_photo_updated"));
    } catch (err) {
      const details = err?.response?.data;
      setMessage(details ? `Failed: ${JSON.stringify(details)}` : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-sm font-black text-[#1e1e2d] tracking-tight uppercase">
          Edit Profile Information
        </h3>
      </div>

      <form className="p-8 space-y-6" onSubmit={handleSubmit}>
        {message && <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">{message}</div>}

        {/* Photo upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="photo">
            Profile Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500">Choose an image to update your profile picture.</p>
        </div>

        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              First Name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={handleChange("first_name")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={handleChange("last_name")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
        </div>

        {/* Company Row (Full Width) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Company
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={handleChange("company_name")}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
          />
        </div>

        {/* Address Row (Full Width) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
          />
        </div>

        {/* City/State Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={handleChange("city")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={handleChange("state")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
        </div>

        {/* ZIP Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={handleChange("postal_code")}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium text-[#1e1e2d]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-50 pt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
