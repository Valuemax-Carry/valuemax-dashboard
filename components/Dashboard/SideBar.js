"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  BoxIcon,
  Package,
  PackagePlus,
  Tags,
} from "lucide-react";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "CreateProducts", href: "/dashboard/create-products", icon: PackagePlus },
  { label: "TotalProducts", href: "/dashboard/total-products", icon: Package },
  { label: "CreateCategory", href: "/dashboard/create-category", icon: Tags },
  { label: "TotalCategories", href: "/dashboard/total-categories", icon: Tags },
];

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours() % 12 === 0 ? 12 : now.getHours() % 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const dayName = weekDays[now.getDay()];
  const monthName = monthNames[now.getMonth()];
  const dateNum = now.getDate();
  const year = now.getFullYear();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API_ORIGIN}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
    } catch (err) {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md border border-gray-100 text-[#b60a01]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Image src={"/logo.png"} alt="Logo" width={36} height={36} />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-[#b60a01]">Value</span>
              <span className="text-[#ffbc0b]">Max</span>
            </h1>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-[#b60a01] transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-4 mt-5 rounded-2xl bg-gradient-to-br from-[#b60a01] via-[#920801] to-[#6e0601] p-5 shadow-lg shadow-red-900/20 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#ffbc0b]/10 animate-pulse" />
          <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/5 animate-pulse" />

          <div className="relative flex items-baseline justify-center gap-1 font-mono">
            <span key={hours} className="text-3xl font-bold text-white tabular-nums animate-in fade-in zoom-in-95 duration-300">
              {hours.toString().padStart(2, "0")}
            </span>
            <span className="text-3xl font-bold text-[#ffbc0b] animate-pulse">:</span>
            <span key={minutes} className="text-3xl font-bold text-white tabular-nums animate-in fade-in zoom-in-95 duration-300">
              {minutes}
            </span>
            <span className="text-3xl font-bold text-[#ffbc0b] animate-pulse">:</span>
            <span key={seconds} className="text-2xl font-semibold text-white/80 tabular-nums animate-in fade-in zoom-in-95 duration-300">
              {seconds}
            </span>
            <span className="text-sm font-semibold text-[#ffbc0b] ml-1.5 self-start mt-1">{ampm}</span>
          </div>

          <div className="relative text-center mt-2">
            <p className="text-sm font-semibold text-white/90 tracking-wide">{dayName}</p>
            <p className="text-xs text-white/60 mt-0.5">{monthName} {dateNum}, {year}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  active
                    ? "bg-gradient-to-r from-[#b60a01] to-[#920801] text-white shadow-md shadow-red-900/20"
                    : "text-gray-600 hover:bg-red-50/60 hover:text-[#b60a01]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#ffbc0b]" />
                )}
                <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-[#b60a01] transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div
            onClick={() => !loggingOut && setShowLogoutModal(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <LogOut className="w-5 h-5 text-[#b60a01]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 text-center">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-400 text-center mt-1.5">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#b60a01] hover:bg-[#920801] transition-all duration-200 disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}