"use client";
import Image from "next/image";
import Link from "next/link";

export default function AuthNavBar() {
  return (
    <div className="flex justify-between py-4 px-6 sm:px-14 bg-[#d7daf7]">
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
    </div>
  );
}
