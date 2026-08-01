"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SideBar from "@/components/Dashboard/SideBar";
import CreateProducts from "@/components/Dashboard/CreateProducts";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setChecking(false);
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      }
    };

    verifyAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-6 h-6 text-[#b60a01] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 px-6 py-8 md:px-10 mt-20 sm:mt-0">
        <div className="max-w-6xl mx-auto">
          <CreateProducts />
        </div>
      </main>
    </div>
  );
}