"use client";
import React, { createContext, useState, ReactNode, useMemo } from "react";
// Wallpapers
import wallpaper0 from "@/public/wallpapers/wallpaper0.webp";
import wallpaper1 from "@/public/wallpapers/wallpaper1.webp";
import wallpaper2 from "@/public/wallpapers/wallpaper2.webp";
import wallpaper3 from "@/public/wallpapers/wallpaper3.webp";
import wallpaper4 from "@/public/wallpapers/wallpaper4.webp";
import wallpaper5 from "@/public/wallpapers/wallpaper5.webp";

import { StaticImageData } from "next/image";

import { IconType } from "react-icons/lib";
import {
  BsFillTerminalFill,
  BsCalculator,
  BsCalendarDate,
  BsBrowserSafari,
  BsFillMusicPlayerFill,
} from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { TbPhoto } from "react-icons/tb";
import { IoApps } from "react-icons/io5";

// Define the shape of the context
interface GlobalContextType {
  homePageActiveWallpaper: string;
  loginPageActiveWallpaper: string;
  theme: string;
  apps: AppInterface[];
  toggleTheme: () => void;
  activeApps: AppInterface[];
  currentActiveApp: AppInterface | null;
  openApp: (app: AppInterface) => void;
  closeApp: (app: AppInterface) => void;
  changeHomeWallpaper: (wallpaper: string) => void;
  changeLoginWallpaper: (wallpaper: string) => void;
  availableWallpapers: StaticImageData[];
}

interface AppInterface {
  name: string;
  icon: IconType;
  defaultSize: { width: number; height: number };
  isResizable: boolean;
}

const apps: AppInterface[] = [
  {
    name: "Terminal",
    icon: BsFillTerminalFill,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Calculator",
    icon: BsCalculator,
    isResizable: false,
    defaultSize: { width: 400, height: 380 },
  },
  {
    name: "Calender",
    icon: BsCalendarDate,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Settings",
    icon: IoSettingsOutline,
    isResizable: true,
    defaultSize: { width: 550, height: 450 },
  },
  {
    name: "Photos",
    icon: TbPhoto,
    isResizable: true,
    defaultSize: { width: 480, height: 300 },
  },
  {
    name: "Safari",
    icon: BsBrowserSafari,
    isResizable: true,
    defaultSize: { width: 200, height: 300 },
  },
  {
    name: "Contact",
    icon: ImProfile,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Music",
    icon: BsFillMusicPlayerFill,
    isResizable: true,
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: "Apps",
    icon: IoApps,
    isResizable: false,
    defaultSize: { width: 400, height: 300 },
  },
];

// Create a Context with default values
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const initialState: Omit<
  GlobalContextType,
  | "toggleTheme"
  | "openApp"
  | "closeApp"
  | "maximizeApp"
  | "minimizeApp"
  | "changeHomeWallpaper"
  | "changeLoginWallpaper"
> = {
  homePageActiveWallpaper: wallpaper4.src,
  loginPageActiveWallpaper: wallpaper1.src,
  theme: "light",
  apps: apps,
  currentActiveApp: null,
  activeApps: [],
  availableWallpapers: [
    wallpaper0,
    wallpaper1,
    wallpaper2,
    wallpaper3,
    wallpaper4,
    wallpaper5,
  ],
};

// ThemeProvider component that wraps the entire app to provide the context
const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalState, setGlobalState] = useState(initialState);

  const toggleTheme = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      theme: prevState.theme === "light" ? "dark" : "light",
    }));
  };

  const changeHomeWallpaper = (wallpaper: string) => {
    setGlobalState((prevState) => ({
      ...prevState,
      homePageActiveWallpaper: wallpaper,
    }));
  };

  const changeLoginWallpaper = (wallpaper: string) => {
    setGlobalState((prevState) => ({
      ...prevState,
      loginPageActiveWallpaper: wallpaper,
    }));
  };

  const openApp = (app: AppInterface) => {
    handleCurrentActiveApp(app.name);
    setGlobalState((prevState) => {
      const isAppAlreadyOpen = prevState.activeApps.some(
        (a) => a.name === app.name
      );
      if (isAppAlreadyOpen) return prevState;
      return {
        ...prevState,
        activeApps: [...prevState.activeApps, app],
      };
    });
  };

  const closeApp = (app: AppInterface) => {
    setGlobalState((prevState) => ({
      ...prevState,
      activeApps: prevState.activeApps.filter((a) => a.name !== app.name),
      currentActiveApp: null,
    }));
  };

  const handleCurrentActiveApp = (appName: string) => {
    const activeApp =
      globalState.apps.find((app) => app.name === appName) || null;
    setGlobalState((prev) => ({ ...prev, currentActiveApp: activeApp }));
  };

  const state = useMemo(
    () => ({
      ...globalState,
      toggleTheme,
      openApp,
      closeApp,
      changeHomeWallpaper,
      changeLoginWallpaper,
    }),
    [globalState]
  );

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
