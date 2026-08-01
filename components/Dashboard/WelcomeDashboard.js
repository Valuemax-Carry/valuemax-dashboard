"use client";

import { useEffect, useState } from "react";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export default function WelcomeDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch(`${API_ORIGIN}/products/all-products`, { method: "GET" });
        const data = await res.json();
        setProducts(data.success ? data.allproducts : []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.productCategories).filter(Boolean)).size;
  const totalCompanies = new Set(products.map((p) => p.productCompany).filter(Boolean)).size;

  const categoryCounts = Object.entries(
    products.reduce((acc, p) => {
      if (!p.productCategories) return acc;
      acc[p.productCategories] = (acc[p.productCategories] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const topCategory = categoryCounts[0]?.[0] || "—";

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
      ),
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      ),
    },
    {
      label: "Brands",
      value: totalCompanies,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.8"><path d="M20 7 12 3 4 7v10l8 4 8-4V7Z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>
      ),
    },
    {
      label: "Top Category",
      value: topCategory,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.8"><path d="m12 2 3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1L12 2Z"/></svg>
      ),
      small: true,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .vm-font { font-family: 'Poppins', sans-serif; }
        .vm-display { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .fade-up-2 { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .fade-up-3 { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .vm-stat-card { transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, border-color 0.18s ease; border: 2px solid transparent; }
        .vm-stat-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(182,10,1,0.12); border-color: #b60a01; }
        .vm-hero-banner { background: linear-gradient(135deg, #b60a01 0%, #8a0700 100%); }
        .vm-skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%); background-size: 400% 100%; animation: skeletonShine 1.4s ease infinite; }
        @keyframes skeletonShine { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
      `}</style>

      <div className="vm-font min-h-screen bg-[#fafafa] px-5 sm:px-8 py-8">
        <div className="max-w-[1280px] mx-auto">

          <div className="fade-up-1 vm-hero-banner rounded-3xl px-6 sm:px-10 py-8 sm:py-10 mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-[2px] text-red-100 font-bold mb-2">ValueMax Cash & Carry</p>
              <h1 className="vm-display text-2xl sm:text-3xl font-extrabold text-white mb-2">Welcome to your Dashboard</h1>
              <p className="text-red-100 text-sm sm:text-[15px] max-w-lg leading-relaxed">
                Manage your product catalog, track categories, and keep your store organized — all in one place.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/10" />
            <div className="absolute right-16 -top-10 w-32 h-32 rounded-full bg-white/10" />
          </div>

          <div className="fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="vm-stat-card bg-white rounded-2xl shadow-sm p-5">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                {loading ? (
                  <div className="vm-skeleton h-6 w-16 rounded-md mb-2" />
                ) : (
                  <p className={`vm-display font-extrabold text-gray-900 mb-1 ${s.small ? "text-base capitalize truncate" : "text-2xl"}`}>
                    {s.value}
                  </p>
                )}
                <p className="text-gray-400 text-[12px] font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="fade-up-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[2px] text-[#b60a01] font-bold mb-1">Overview</p>
                <h2 className="vm-display text-lg font-extrabold text-gray-900">Products by Category</h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="vm-skeleton h-8 rounded-lg" />
                ))}
              </div>
            ) : categoryCounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
                </div>
                <p className="text-gray-800 font-semibold text-sm mb-1">No products yet</p>
                <p className="text-gray-400 text-[13px]">Add products to see category insights here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryCounts.map(([category, count]) => {
                  const percent = totalProducts ? Math.round((count / totalProducts) * 100) : 0;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-700 text-[13px] font-semibold capitalize">{category}</span>
                        <span className="text-gray-400 text-[12px] font-medium">{count} product{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#b60a01] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}