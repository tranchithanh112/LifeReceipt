import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,border-color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        /** The one loud button on any given screen. */
        primary:
          "bg-ink text-paper rounded-full shadow-[0_2px_0_0_rgba(22,19,15,0.25)] hover:bg-[#2a251e]",
        outline:
          "border border-ink/25 text-ink rounded-full bg-transparent hover:border-ink/60 hover:bg-ink/[0.04]",
        ghost: "text-ink-muted rounded-full hover:bg-ink/[0.06] hover:text-ink",
        stamp:
          "bg-stamp text-white rounded-full shadow-[0_2px_0_0_rgba(140,38,18,0.35)] hover:bg-[#a72d15]",
        link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-14 px-7 text-base sm:text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
