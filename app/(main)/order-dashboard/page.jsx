"use client";
import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  CheckCircle2,
  Circle,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

const steps = ["Order Received", "In Production", "Shipped", "Delivered"];

const OrderCard = ({ order }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Order Header */}
    <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="font-black text-[#1e1e2d]">Order #{order.id}</h3>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600">
          In Production
        </span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCcw size={12} /> Reorder
        </button>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="px-8 py-10 bg-gray-50/30">
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-1000"
          style={{ width: "33.33%" }}
        />
        {steps.map((step, idx) => {
          const isCompleted = idx < 2;
          const isCurrent = idx === 1;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors
                  ${isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-tighter whitespace-nowrap
                  ${isCurrent ? "text-blue-600" : "text-gray-400"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Order Details */}
    <div className="p-5 border-t border-gray-50">
      <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
        {order.details}
      </p>
    </div>
  </div>
);

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/bookings/");
        setOrders(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please log in to view your orders.");
        } else {
          setError("Failed to load orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-7">
      <Link
        href="/dashboard"
        className="text-sm text-red-600 font-semibold text-base hover:underline mb-8 flex items-center gap-1"
      >
        <ChevronLeft size={16} /> Back To Profile
      </Link>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#1e1e2d] tracking-tight">
          Order Dashboard
        </h2>
        <p className="text-sm text-gray-400 font-medium">
          Track your orders and reorder with one click
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              <div className="p-5 border-b border-gray-50">
                <div className="h-5 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="px-8 py-10 bg-gray-50/30">
                <div className="h-1 bg-gray-200 rounded" />
              </div>
              <div className="p-5">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-bold text-lg mb-2">No orders yet</p>
          <p className="text-sm">Your orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Support Section */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 space-y-4">
        <h3 className="font-black text-[#1e1e2d]">Need Help?</h3>
        <p className="text-sm text-gray-500 font-medium max-w-xl">
          If you have questions about your order or need to make changes, our
          team is here to help.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 h-fit w-fit">
          <MessageSquare size={18} /> Contact Support
        </button>
      </div>
    </div>
  );
};

export default OrderDashboard;
