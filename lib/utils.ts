import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type guard to check if the error is an RtkQueryError
export function isRtkQueryError(error: any): error is RtkQueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error
  );
}
