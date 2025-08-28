import Image from "next/image";
import UpcommingEvents from "@/components/UpcommingEvents";
import PreviousEvents from "@/components/PreviousEvents";
import HeroSection from "@/components/ui/layouts/HeroSection";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src="/Hero.jpg"
          alt="Hero Banner"
          width={1920}
          height={610}
          priority
          className="object-cover"
        />

        {/* Overlapping Hero Section */}
        {/* <div className="absolute inset-0 flex items-center justify-center"> */}
        <HeroSection />
        {/* </div> */}
      </div>

      {/* Upcoming Events Section */}
      <div className="px-6 sm:px-14 my-10">
        <UpcommingEvents />
      </div>

      {/* Previous Events Section */}
      <div className="px-6 sm:px-14 my-10">
        <PreviousEvents />
      </div>
    </div>
  );
}
