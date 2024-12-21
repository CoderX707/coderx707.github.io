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

const appComponents: { [key: string]: React.FC } = {
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
        backgroundImage: `url(${context?.homePageWallpaper})`,
      }}
    >
      <TopBar />
      {/* Open Apps */}
      <AnimatePresence>
        {activeApps?.map((appName) => {
          const AppComponent = appComponents[appName];
          if (!AppComponent) return null;
          return (
            <AppWindow
              key={appName}
              isOpen={true}
              onClose={() => closeApp(appName)}
              title={appName}
            >
              <AppComponent />
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
