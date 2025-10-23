"use client";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

type Props = {
  text: string;
  size?: number;
  className?: string;
};

export default function CopyToClipboard({ text, className, size = 16 }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className={cn("relative text-gray-600 size-6", className)}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        // toast.success("Copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy to clipboard"
    >
      <Copy size={size} className={cn(copied && "text-green-600")} />
      {copied && (
        <span
          className={cn(
            "absolute -top-3 -right-3 text-[10px] text-green-600 bg-white dark:bg-gray-800 px-1 rounded",
            "transition-all duration-300 ease-in-out",
            copied ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
        >
          Copied!
        </span>
      )}
    </Button>
  );
}
