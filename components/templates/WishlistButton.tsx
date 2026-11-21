"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  slug: string;
  initialCount?: number;
  initialLiked?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
  onToggle?: (newCount: number, hasLiked: boolean) => void;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("vv_visitor_id");
    if (!id) {
      id = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      localStorage.setItem("vv_visitor_id", id);
    }
    return id;
  } catch {
    return "";
  }
}

export default function WishlistButton({
  slug,
  initialCount = 0,
  initialLiked = false,
  size = "md",
  showCount = true,
  className = "",
  onToggle,
}: WishlistButtonProps) {
  const [hasLiked, setHasLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  useEffect(() => {
    setLikesCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    setHasLiked(initialLiked);
  }, [initialLiked]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // Optimistic toggle
    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setHasLiked(nextLiked);
    setLikesCount(nextCount);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);

    if (onToggle) {
      onToggle(nextCount, nextLiked);
    }

    try {
      setLoading(true);
      const visitorId = getOrCreateVisitorId();
      const res = await fetch(`/api/templates/${encodeURIComponent(slug)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: visitorId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setHasLiked(data.hasLiked);
          setLikesCount(data.likesCount);
          if (onToggle) {
            onToggle(data.likesCount, data.hasLiked);
          }
        }
      }
    } catch {
      // Revert on error
      setHasLiked(!nextLiked);
      setLikesCount(likesCount);
    } finally {
      setLoading(false);
    }
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={hasLiked ? "Unlike template" : "Like template"}
      title={hasLiked ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex items-center gap-1.5 transition-all select-none cursor-pointer rounded-full ${
        hasLiked
          ? "text-rose-600 hover:text-rose-700"
          : "text-stone-400 hover:text-rose-500 hover:bg-rose-50/50"
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          animating ? "scale-125" : "scale-100"
        } ${hasLiked ? "fill-rose-500 text-rose-500" : "fill-transparent stroke-current"}`}
      />
      {showCount && (
        <span
          className={`font-semibold font-mono tabular-nums leading-none ${textSizes[size]} ${
            hasLiked ? "text-rose-600 font-bold" : "text-stone-500"
          }`}
        >
          {likesCount}
        </span>
      )}
    </button>
  );
}
