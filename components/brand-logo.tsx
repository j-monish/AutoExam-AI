"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
}

export function BrandLogo({
  size = "md",
  showTagline = false,
  href,
}: BrandLogoProps) {
  const iconSize = size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10";
  const iconIcon = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5";
  const textSize = size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg";
  const taglineSize = size === "sm" ? "text-[10px]" : "text-xs";

  const content = (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-2.5">
        <div className={`${iconSize} rounded-lg bg-[#6C63FF] flex items-center justify-center`}>
          <BookOpen className={iconIcon} />
        </div>
        <span className={`${textSize} font-semibold text-[#F5F5F5] tracking-tight`}>
          AutoExam AI
        </span>
      </div>
      {showTagline && (
        <p className={`${taglineSize} text-[#71717A] ml-[calc(${iconSize}+0.625rem)] tracking-wide`}>
          Generate • Evaluate • Grade
        </p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="group">{content}</Link>;
  }
  return content;
}
