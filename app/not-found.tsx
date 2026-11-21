import Link from "next/link";
import { Sparkles, Home, ArrowRight, Heart } from "lucide-react";
import PublicHeader from "@/components/public/Header";
import PublicFooter from "@/components/public/Footer";

export default function NotFound() {
  const quickCategories = [
    { name: "Wedding (Vivah Patrika)", href: "/templates?category=wedding" },
    { name: "Sagai (Engagement)", href: "/templates?category=engagement" },
    { name: "Anniversary (Varshgaanth)", href: "/templates?category=anniversary" },
    { name: "Janamdin (Birthday)", href: "/templates?category=birthday" },
    { name: "Griha Pravesh (Housewarming)", href: "/templates?category=housewarming" },
    { name: "Reception (Pratibhoj)", href: "/templates?category=reception" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans flex flex-col justify-between selection:bg-rose-200 selection:text-rose-950">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center py-20 px-6 sm:px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" /> 404 - Page Nahi Mila
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold text-stone-900 mb-4 tracking-tight">
            404
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-3">
            Lagta Hai Yeh Prishth Kahin Kho Gaya Hai
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
            Aap jis page ko dhoondh rahe hain wo shayad badal diya gaya hai ya uplabdh nahi hai. Aap neeche diye gaye links se shuru kar sakte hain:
          </p>

          {/* QUICK CATEGORY LINKS */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm mb-8 text-left">
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Lokpriya Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-rose-700 transition"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-rose-500" /> {cat.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-stone-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition shadow-sm"
            >
              <Home className="w-4 h-4" /> Homepage Par Jayein
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition"
            >
              Sahayata Ke Liye Sampark Karein
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

