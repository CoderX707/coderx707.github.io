import { CustomImage } from "@/app/components/System/Global";
import { StaticImageData } from "next/image";
import { memo } from "react";

export const WallpaperItem = memo(
  ({
    wallpaper,
    index,
    callback,
    isAppWindowResizing,
  }: {
    wallpaper: StaticImageData;
    index: number;
    callback: () => void;
    isAppWindowResizing: boolean;
  }) => {
    return (
      <>
        {/* Wallpaper Image */}
        {!isAppWindowResizing ? (
          <CustomImage
            src={wallpaper}
            alt={`wallpaper ${index}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute bg-gray-400 w-full h-full" />
        )}
        {/* Text with Black Blur Background */}
        <button
          className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center p-2 cursor-pointer"
          onClick={callback}
        >
          Wallpaper {index}
        </button>
      </>
    );
  }
);

// Display Name: The displayName property helps React identify the component name in stack traces, React DevTools, and any other debugging tools.
WallpaperItem.displayName = "WallpaperItem";
