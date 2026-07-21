"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface ArrowButtonProps {
  className?: string;
}

export function ArrowButton({ className }: ArrowButtonProps = {}) {
  return (
    <div
      className={`group relative w-10 h-10 cursor-pointer overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#B0B0B5] hover:text-[#F5F5F5] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </div>
  );
}
