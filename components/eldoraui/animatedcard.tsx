"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const MainMenusGradientCard = ({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className="rounded-2xl bg-[#17181B] border border-white/[0.06] shadow-card overflow-hidden">
      {/* Sticky header */}
      <div
        className={cn(
          "sticky top-0 z-10 border-b border-white/[0.06] bg-[#17181B]/95 backdrop-blur-sm",
          className
        )}
      >
        <div className="px-6 py-4">
          <h3 className="text-base font-semibold text-[#F5F5F5]">{title}</h3>
          <p className="mt-1 text-sm text-[#71717A] line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Content body */}
      <div className="px-6 py-6">{children}</div>
    </div>
  );
};
