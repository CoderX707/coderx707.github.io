import useGridClasses from "@/app/Hooks/useGridClasses";
import { WindowSizeProps } from "../../types";
import { memo, useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/app/contexts/GlobalContext";
import { StaticImageData } from "next/image";
import { WallpaperItem } from "./components";
import { CustomImage } from "../../System/Global";

const gridRules = {
  menu: {
    "col-span": {
      mobile: "2",
      tablet: "2",
      desktop: "3",
    },
  },
  body: {
    "col-span": {
      mobile: "10",
      tablet: "10",
      desktop: "9",
    },
  },
  wallpapersContainer: {
    "col-span": {
      mobile: "6",
      tablet: "4",
      desktop: "3",
    },
  },
};

const Settings = memo(
  ({ windowSize, isAppWindowResizing }: WindowSizeProps) => {
    const { gridClasses } = useGridClasses(windowSize, gridRules);
    const context = useContext(GlobalContext);
    const [state, setState] = useState<{ wallpapers: StaticImageData[] | [] }>({
      wallpapers: [],
    });

    useEffect(() => {
      if (state?.wallpapers?.length >= 0) {
        setState((prev) => ({
          ...prev,
          wallpapers: [...(context?.availableWallpapers || [])],
        }));
      }
    }, []);

    return (
      <div className="grid gap-2 p-3">
        <div className={`bg-gray-800 ${gridClasses.menu}`}>
          <ul>
            <li>Wallpaper</li>
            <li>Lock Screen</li>
          </ul>
        </div>
        <div className={`body ${gridClasses.body}`}>
          <div className="mb-8">
            <div className="relative h-56">
              {/* Wallpaper Image */}
              <CustomImage />
              {!isAppWindowResizing &&context?.homePageActiveWallpaper ? (
                <CustomImage
                  src={context?.homePageActiveWallpaper}
                  alt="Home wallpaper"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute bg-gray-400 w-full h-full" />
              )}
              {/* Text with Black Blur Background */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white text-center p-2">
                Current Wallpaper
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Wallpapers</h3>
          <div className="grid gap-2">
            {state?.wallpapers?.map((wallpaper, i) => (
              <div
                className={`${gridClasses.wallpapersContainer} relative h-32`}
                key={wallpaper?.src}
              >
                <WallpaperItem
                  wallpaper={wallpaper}
                  callback={() => {
                    context?.changeHomeWallpaper(wallpaper.src);
                  }}
                  index={i + 1}
                  isAppWindowResizing={isAppWindowResizing}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Settings.displayName = "Settings";

export default Settings;
