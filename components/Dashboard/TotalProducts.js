"use client";

import { useEffect, useState } from "react";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

function getImageSrc(productImage) {
  if (!productImage) return null;
  if (typeof productImage === "string") return productImage;
  if (productImage.url) return productImage.url;
  if (productImage.data && productImage.data.data && productImage.contentType) {
    const bytes = new Uint8Array(productImage.data.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:${productImage.contentType};base64,${btoa(binary)}`;
  }
  return null;
}

export default function TotalProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_ORIGIN}/products/all-products`, { method: "GET" });
        const data = await res.json();
        if (data.success) {
          setProducts(data.allproducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory]);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.productCategories).filter(Boolean)))];

  const filtered = selectedCategory === "All" ? products : products.filter((p) => p.productCategories === selectedCategory);

  const visibleProducts = filtered.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleShowLess = () => {
    setVisibleCount(8);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_ORIGIN}/products/delete-product/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .vm-font { font-family: 'Poppins', sans-serif; }
        .vm-display { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-in { animation: fadeIn 0.25s ease both; }
        .popup-in { animation: popupIn 0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .vm-card { transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, border-color 0.18s ease; border: 2px solid transparent; }
        .vm-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(182,10,1,0.12); border-color: #b60a01; }
        .vm-filter-btn { transition: all 0.18s ease; }
        .vm-filter-btn.active { background: #b60a01; color: #fff; box-shadow: 0 4px 14px rgba(182,10,1,0.25); }
        .vm-filter-btn:not(.active) { background: #fff; color: #374151; border: 1.5px solid #e5e7eb; }
        .vm-filter-btn:not(.active):hover { border-color: #b60a01; color: #b60a01; }
        .vm-delete-btn { transition: all 0.18s ease; }
        .vm-delete-btn:hover { background: #9a0800; }
        .vm-overlay { animation: fadeIn 0.2s ease both; }
        .vm-showmore-btn { transition: all 0.18s ease; }
        .vm-showmore-btn:hover { background: #9a0800; }
        .vm-showless-btn { transition: all 0.18s ease; }
        .vm-showless-btn:hover { background: #f3f4f6; }
      `}</style>

      <div className="vm-font min-h-screen bg-[#fafafa] px-5 sm:px-8 py-8">
        <div className="max-w-[1280px] mx-auto">

          <div className="fade-up mb-8">
            <p className="text-[11px] uppercase tracking-[2px] text-[#b60a01] font-bold mb-1">ValueMax Cash & Carry</p>
            <h1 className="vm-display text-2xl sm:text-3xl font-extrabold text-gray-900">Product Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              {products.length} total product{products.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && <span className="text-[#b60a01] font-semibold"> · {selectedCategory}</span>}
            </p>
          </div>

          <div className="fade-up bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`vm-filter-btn ${selectedCategory === c ? "active" : ""} px-4 py-2 rounded-xl text-[13px] font-semibold`}
              >
                {c}
                <span className={`ml-2 text-[11px] font-bold ${selectedCategory === c ? "text-red-200" : "text-gray-400"}`}>
                  {c === "All" ? products.length : products.filter((p) => p.productCategories === c).length}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="fade-in bg-red-50 border border-red-100 text-[#b60a01] text-sm font-medium rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#b60a01] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="fade-in flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
              </div>
              <p className="text-gray-800 font-semibold text-base mb-1">No products found</p>
              <p className="text-gray-400 text-sm">Try a different category or add new products.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {visibleProducts.map((p) => {
                  const src = getImageSrc(p.productImage);
                  return (
                    <div key={p._id} className="vm-card bg-white rounded-2xl overflow-hidden shadow-sm">
                      <div className="relative w-full h-40 bg-gray-50 overflow-hidden">
                        {src ? (
                          <img src={src} alt={p.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-[#b60a01] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                            {p.productCategories}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <p className="font-semibold text-gray-900 text-[14px] leading-snug mb-1 line-clamp-2">{p.productName}</p>
                        <p className="text-gray-400 text-[12px] mb-3">{p.productCompany}</p>
                        <p className="text-gray-400 text-[12px] mb-3">Rs.{p.productPrice}</p>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="vm-delete-btn w-full bg-[#b60a01] text-white text-[12px] font-bold px-3.5 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < filtered.length && (
                <div className="fade-in flex justify-center mt-8">
                  <button
                    onClick={handleShowMore}
                    className="vm-showmore-btn bg-[#b60a01] text-white text-[13px] font-bold px-6 py-3 rounded-xl"
                  >
                    Show More
                  </button>
                </div>
              )}

              {visibleCount >= filtered.length && filtered.length > 8 && (
                <div className="fade-in flex justify-center mt-8">
                  <button
                    onClick={handleShowLess}
                    className="vm-showless-btn bg-white text-[#b60a01] border border-[#b60a01] text-[13px] font-bold px-6 py-3 rounded-xl"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div className="vm-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="popup-in vm-font relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b60a01" strokeWidth="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>
            </div>
            <h2 className="vm-display text-lg font-extrabold text-gray-900 mb-1">Delete Product</h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteTarget.productName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="vm-delete-btn flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#b60a01] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}