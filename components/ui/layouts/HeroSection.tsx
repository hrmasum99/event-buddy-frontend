import SearchOption from "./SearchOption";

export default function HeroSection() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-20 gap-0 sm:gap-2 lg:gap-4 2xl:gap-8">
      <h5 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl text-mac-air text-for-1920px font-medium text-[#250A63]">
        Discover
      </h5>
      <h5 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl text-mac-air text-for-1920px font-medium text-[#250A63]">
        <span className="text-[#4157FE]">Amazing</span> Events
      </h5>
      <p className="mt-1 sm:mt-2 text-[7px] sm:text-xs md:text-sm lg:text-sm xl:text-lg 2xl:text-xl text-[#250A63] max-w-xs sm:max-w-lg xl:max-w-4xl">
        Find and book events that match your interests. From tech conferences to
        music festivals, we've got you covered.
      </p>

      <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-xl xl:text-2xl 2xl:text-3xl text-[#250A63] font-medium">
        Find your next event
      </p>

      <div className="w-full search-bar-iphone-se search-bar-iphone sm:max-w-md lg:max-w-lg 2xl:max-w-2xl">
        <SearchOption />
      </div>
    </div>
  );
}
