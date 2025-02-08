"use client";
import { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { TopBar, AppWindow, Dock } from "@/app/components/System/Desktop";
import {
  Calculator,
  Calender,
  Safari,
  Terminal,
  Settings,
  Photos,
  Music,
  Contact,
} from "../Apps";
import { GlobalContext } from "@/app/contexts/GlobalContext";
import { WindowSizeProps } from "../types";

const appComponents: { [key: string]: React.FC<WindowSizeProps> } = {
  Calculator,
  Calender,
  Safari,
  Terminal,
  Settings,
  Photos,
  Music,
  Contact,
};

const HomeScreen: React.FC = () => {
  const context = useContext(GlobalContext);

  if (!context) return null;

  const { activeApps, closeApp } = context;
  return (
    <div
      className="h-screen text-white relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${context?.homePageActiveWallpaper})`,
      }}
    >
      <TopBar />
      {/* Open Apps */}
      <AnimatePresence>
        {activeApps?.map((app) => {
          const AppComponent = appComponents[app.name];
          if (!AppComponent) return null;
          return (
            <AppWindow
              key={app.name}
              defaultSize={app.defaultSize}
              onClose={() => closeApp(app)}
              isResizable={app.isResizable}
            >
              <AppComponent
                windowSize={app.defaultSize}
                isAppWindowResizing={app.isResizable}
              />
            </AppWindow>
          );
        })}
      </AnimatePresence>
      {/* Dock */}
      <Dock />
    </div>
  );
};

export default HomeScreen;
