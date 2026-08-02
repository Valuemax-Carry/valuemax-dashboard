"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, CheckCircle2, XCircle, X } from "lucide-react";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

const categories = [
  { label: "Baby Care", value: "baby-care" },
  { label: "Snacks", value: "snacks" },
  { label: "Tea & Coffee", value: "tea-coffee" },
  { label: "Pulses", value: "pulses" },
  { label: "Rice", value: "rice" },
  { label: "Dairy Products", value: "dairy" },
  { label: "Flour", value: "flour" },
  { label: "Oil & Ghee", value: "oil-ghee" },
  { label: "Sugar", value: "sugar" },
  { label: "Detergents", value: "detergents" },
  { label: "Frozen", value: "frozen" },
  { label: "Ice Cream", value: "icecream" },
  { label: "Drinks & Beverages", value: "drinks-beverages" },
];

export default function CreateProducts() {
  const fileInputRef = useRef(null);
  const [productName, setProductName] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [productCompany, setProductCompany] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setProductName("");
    setProductCategories("");
    setProductCompany("");
    setProductPrice("");
    removeImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!productName || !productCategories || !productCompany ||  !imageFile) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productCategories", productCategories);
      formData.append("productCompany", productCompany);
      formData.append("productPrice", productPrice);
      formData.append("productImage", imageFile);

      const res = await fetch(`${API_ORIGIN}/products/create-product`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(data.message || "Product added Successfully");
        resetForm();
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 transition-all duration-300">
      <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
      <p className="text-sm text-gray-400 mt-1">
        Fill in the details below to add a product to your catalog.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Basmati Rice 5kg"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#b60a01] focus:ring-2 focus:ring-[#b60a01]/10 transition-all duration-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={productCategories}
              onChange={(e) => setProductCategories(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#b60a01] focus:ring-2 focus:ring-[#b60a01]/10 transition-all duration-200 text-sm bg-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={productCompany}
              onChange={(e) => setProductCompany(e.target.value)}
              placeholder="e.g. Nestle"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#b60a01] focus:ring-2 focus:ring-[#b60a01]/10 transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="e.g. 100"
            min="0"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#b60a01] focus:ring-2 focus:ring-[#b60a01]/10 transition-all duration-200 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Product Image
          </label>

          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200"
              >
                <X className="w-4 h-4 text-[#b60a01]" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="productImage"
              className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#b60a01] cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-red-50/30"
            >
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">
                Click to upload an image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </span>
              <input
                id="productImage"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 animate-in fade-in duration-200">
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-[#b60a01] hover:bg-[#920801] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
}