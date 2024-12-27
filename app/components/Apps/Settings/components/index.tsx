import { memo } from "react";

export const WallpaperItem = memo(
  ({
    wallpaper,
    index,
    callback,
  }: {
    wallpaper: string;
    index: number;
    callback: () => void;
  }) => {
    return (
      <>
        {/* Wallpaper Image */}
        <img
          src={wallpaper}
          alt={`wallpaper ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Text with Black Blur Background */}
        <button
          className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center p-2 cursor-pointer"
          onClick={callback}
        >
          Wallpaper {index + 1}
        </button>
      </>
    );
  }
);

// Display Name: The displayName property helps React identify the component name in stack traces, React DevTools, and any other debugging tools.
WallpaperItem.displayName = "WallpaperItem";
