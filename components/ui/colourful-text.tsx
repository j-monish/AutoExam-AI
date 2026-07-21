"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export function ColourfulText({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[#F5F5F5]">
      <span className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center">
        <BookOpen className="w-4 h-4" />
      </span>
      <span className="font-semibold tracking-tight">{text}</span>
    </span>
  );
}
