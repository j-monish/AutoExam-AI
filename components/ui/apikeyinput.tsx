"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Inputp = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("input-base", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Inputp.displayName = "Inputp";

export { Inputp };
