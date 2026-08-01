import Image from "next/image";
import { User } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <nav className="flex justify-between items-center w-full h-16 bg-white px-6 shadow-md border-b border-gray-100">
      <div className="flex items-center gap-3">
        <Image src={"/logo.png"} alt="Logo" width={48} height={48} />
        <h1 className="text-2xl font-bold tracking-tight text-[#b60a01]">
          Value<span className="text-[#ffbc0b]">Max</span>
        </h1>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[1.2px]">Cash & Carry</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200 px-4 py-2 rounded-full">
          <div className="flex items-center justify-center w-8 h-8 bg-[#b60a01] rounded-full">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-sm">Admin</span>
        </button>
      </div>
    </nav>
  );
}