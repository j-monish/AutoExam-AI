"use client";

import React from "react";
import Image from "next/image";
import fahim from "../app/assets/img/fahim.jpg";

export function About() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative">
        <Image
          height={40}
          width={40}
          src={fahim.src}
          alt="Fahim"
          className="w-10 h-10 rounded-full object-cover border-2 border-white/[0.08]"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-[#0B0B0C]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[#B0B0B5]">Fahim</p>
        <p className="text-xs text-[#71717A]">Creator</p>
      </div>
    </div>
  );
}
