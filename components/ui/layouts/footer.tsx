"use client";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 sm:px-14 bg-[#d7daf7] py-6">
      <div className="flex flex-col min-[830px]:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/ticket-1.svg"
            alt="Ticket icon"
            width={26.962963104248047}
            height={26.962963104248047}
          />
          <Link href="/" className="text-xl font-bold text-[#250A63]">
            Event buddy
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/" className="text-[#2C2575]">
            Home
          </Link>
          <Link href="/signin" className="text-[#2C2575]">
            Sign in
          </Link>
          <Link href="/signup" className="text-[#2C2575]">
            Sign up
          </Link>
          <Link href="/" className="text-[#2C2575]">
            Privacy Policy
          </Link>
        </div>
      </div>

      <Separator className="border border-[#2C257521] my-6" />

      <div className="text-[#6A6A6A] text-center">
        <p>© 2025 Event buddy. All rights reserved.</p>
      </div>
    </footer>
  );
}
