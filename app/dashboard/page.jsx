"use client";
import React, { useState, useEffect } from "react";
import { Box } from "lucide-react";
import axios from "@/lib/axios";

const statusClasses = {
  received: "bg-slate-50 text-slate-600",
  production: "bg-amber-50 text-amber-600",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/bookings/");
        setOrders(response.data);
      } catch {
        // silently fail — user may not be logged in yet
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h3 className="font-black text-lg">Recent Activity</h3>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="font-medium">No recent activity</p>
          <p className="text-sm mt-1">Your orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                  <Box size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">
                    {order.order_number || `Order #${order.id}`}
                  </p>
                  <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-xs">
                    {order.details}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${statusClasses[order.status] || statusClasses.received}`}>
                  {order.status_display || order.status || "Order Received"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
