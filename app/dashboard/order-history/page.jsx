"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import axios from "@/lib/axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/bookings/");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status) => ({
    received: "bg-slate-50 text-slate-600",
    production: "bg-amber-50 text-amber-600",
    shipped: "bg-blue-50 text-blue-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-600",
  }[status] || "bg-slate-50 text-slate-600");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-black tracking-tight">Order History</h3>
      </div>

      {/* DESKTOP TABLE VIEW */}
      {loading ? (
        <div className="p-8 space-y-4">
          {[...Array(4)].map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-sm font-medium text-gray-400">No order history yet.</div>
      ) : <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Order ID
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Items
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-8 py-5 text-sm font-bold text-[#1e1e2d]">
                  {order.order_number || `ORD-${order.id}`}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-gray-500 text-center">
                  {order.item_count}
                </td>
                <td className="px-8 py-5 text-sm font-black text-[#1e1e2d]">
                  ${order.total_amount}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusClass(order.status)}`}
                  >
                    {order.status_display || order.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1.5 ml-auto">
                    View Details <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* MOBILE CARD VIEW */}
      {!loading && orders.length > 0 && <div className="md:hidden divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Order ID
                </p>
                <p className="font-black text-[#1e1e2d]">{order.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusClass(order.status)}`}
              >
                {order.status_display || order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Date
                </p>
                <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Total
                </p>
                <p className="text-sm font-black text-[#1e1e2d]">${order.total_amount}</p>
              </div>
            </div>

            <button className="w-full py-3 border border-gray-100 rounded-xl text-sm font-bold text-blue-600 bg-gray-50/50 active:bg-gray-100 transition-colors">
              View Order Details
            </button>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default OrderHistory;
