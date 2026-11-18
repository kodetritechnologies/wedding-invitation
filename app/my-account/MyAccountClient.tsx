"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MyAccountClient() {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage or cookies
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-stone-800">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="w-8 h-8 text-rose-700 animate-spin" />
        <p className="text-sm font-medium text-stone-600">Aapka account check kiya ja raha hai...</p>
      </div>
    </div>
  );
}

