import SearchOption from "./SearchOption";

export default function HeroSection() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-20">
      {/* Main Content Container - Fixed structure to prevent layout shift */}
      <div className="flex flex-col items-center gap-1 sm:gap-2 xl:gap-3 mb-2 lg:mb-4">
        <h1 className="mobile-header-size sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-mac-air text-for-1920px font-medium text-[#250A63]">
          Discover
        </h1>
        <h1 className="mobile-header-size sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-mac-air text-for-1920px font-medium text-[#250A63]">
          <span className="text-[#4157FE]">Amazing</span> Events
        </h1>

        <p className="mt-1 sm:mt-2 mobile-text-size mobile-max-width text-[#250A63] max-w-[280px] sm:max-w-lg lg:max-w-2xl 2xl:max-w-4xl text-[7px] sm:text-xs lg:text-sm xl:text-base 2xl:text-lg">
          Find and book events that match your interests. From tech conferences
          to music festivals, we've got you covered.
        </p>

        <p className="mt-2 sm:mt-4 mobile-text-size text-[#250A63] font-medium text-xs sm:text-sm md:text-base xl:text-lg 2xl:text-xl">
          Find your next event
        </p>
      </div>

      {/* Search Container - Isolated to prevent layout issues */}
      <div className="w-full search-bar-iphone-se search-bar-iphone sm:max-w-md lg:max-w-lg 2xl:max-w-2xl">
        <SearchOption />
      </div>
    </div>
  );
}
