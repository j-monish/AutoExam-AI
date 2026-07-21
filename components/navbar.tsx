"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, History, Settings, Github } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0B0B0C]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-[#F5F5F5] tracking-tight">
            AutoExam AI
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/chat"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/chat"
                ? "text-[#F5F5F5] bg-white/[0.06]"
                : "text-[#B0B0B5] hover:text-[#F5F5F5] hover:bg-white/[0.03]"
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#B0B0B5] hover:text-[#F5F5F5] hover:bg-white/[0.03] transition-all duration-200"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#B0B0B5] hover:text-[#F5F5F5] hover:bg-white/[0.03] transition-all duration-200"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
}
