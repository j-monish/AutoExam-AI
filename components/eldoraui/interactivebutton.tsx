"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface InteractiveHoverButtonProps {
  text?: string;
  className?: string;
}

export function InteractiveHoverButton({
  text = "Start For Free",
  className,
}: InteractiveHoverButtonProps = {}) {
  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-[#6C63FF] px-6 py-3 text-center font-medium text-sm text-white transition-all duration-200 hover:bg-[#7B74FF] hover:shadow-[0_0_24px_rgba(108,99,255,0.3)] active:scale-[0.98] ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        {text}
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </div>
  );
}
