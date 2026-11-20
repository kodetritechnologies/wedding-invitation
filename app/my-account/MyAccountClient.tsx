"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MyAccountClient() {
  const router = useRouter();

  useEffect(() => {
    async function verifySession() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_auth_token") || localStorage.getItem("token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/auth/me", {
          headers,
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            router.replace("/dashboard");
            return;
          }
        }
        router.replace("/?login=true");
      } catch {
        router.replace("/?login=true");
      }
    }

    verifySession();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-stone-800 font-sans">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="w-8 h-8 text-[#5C0612] animate-spin" />
        <p className="text-sm font-medium text-stone-600">Aapka account check kiya ja raha hai...</p>
      </div>
    </div>
  );
}

