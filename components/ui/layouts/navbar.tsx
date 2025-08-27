"use client";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav";

export default function CustomNavBar() {
  return (
    <div className="flex justify-between py-4 px-6 sm:px-14 items-center">
      {/* Left Logo + Brand */}
      <div className="flex items-center gap-2">
        <Image
          src="/ticket-1.svg"
          alt="Ticket icon"
          width={26.96}
          height={26.96}
        />
        <Link href="/" className="text-xl font-bold text-[#250A63]">
          Event buddy
        </Link>
      </div>

      {/* Right Nav */}
      <MainNav />
    </div>
  );
}
