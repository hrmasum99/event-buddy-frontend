import Image from "next/image";
import UpcommingEvents from "@/components/UpcommingEvents";
import PreviousEvents from "@/components/PreviousEvents";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="w-full h-auto">
        <Image
          src="/Hero 03.png"
          alt="Hero Banner"
          width={1920}
          height={610}
          priority
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Upcoming Events Section */}
      <div className="px-10 sm:px-14 my-10">
        <UpcommingEvents />
      </div>

      {/* Previous Events Section */}
      <div className="px-10 sm:px-14 my-10">
        <PreviousEvents />
      </div>
    </div>
  );
}
