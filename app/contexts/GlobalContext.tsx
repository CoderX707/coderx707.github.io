"use client";
import React, { createContext, useState, ReactNode, useMemo } from "react";
// Wallpapers
import wallpaper0 from "@/public/wallpapers/wallpaper0.webp";
import wallpaper1 from "@/public/wallpapers/wallpaper1.webp";
import wallpaper2 from "@/public/wallpapers/wallpaper2.webp";
import wallpaper3 from "@/public/wallpapers/wallpaper3.webp";
import wallpaper4 from "@/public/wallpapers/wallpaper4.webp";
import wallpaper5 from "@/public/wallpapers/wallpaper5.webp";

// Icons
import calculatorIcon from "@/public/icons/calculator.png";
import TerminalIcon from "@/public/icons/terminal.png";
import PhotosIcon from "@/public/icons/photos.png";
import SettingsIcon from "@/public/icons/settings.png";
import CalenderIcon from "@/public/icons/calender.png";
import ContactsIcon from "@/public/icons/contacts.png";
import SafariIcon from "@/public/icons/safari.png";
import MusicIcon from "@/public/icons/music.png";
import { StaticImageData } from "next/image";

// Define the shape of the context
interface GlobalContextType {
  homePageActiveWallpaper: string;
  loginPageActiveWallpaper: string;
  theme: string;
  apps: AppInterface[];
  toggleTheme: () => void;
  activeApps: string[];
  currentActiveApp: AppInterface | null;
  openApp: (appName: string) => void;
  closeApp: (appName: string) => void;
  changeHomeWallpaper: (wallpaper: string) => void;
  changeLoginWallpaper: (wallpaper: string) => void;
  availableWallpapers: StaticImageData[];
}

interface AppInterface {
  name: string;
  icon: StaticImageData;
  defaultSize: { width: number; height: number };
  isResizable: boolean;
}

const apps: AppInterface[] = [
  {
    name: "Terminal",
    icon: TerminalIcon,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Calculator",
    icon: calculatorIcon,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Calender",
    icon: CalenderIcon,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Photos",
    icon: PhotosIcon,
    isResizable: true,
    defaultSize: { width: 400, height: 300 },
  },
  {
    name: "Safari",
    icon: SafariIcon,
    isResizable: true,
    defaultSize: { width: 200, height: 300 },
  },
  {
    name: "Contact",
    icon: ContactsIcon,
    isResizable: true,
    defaultSize: { width: 800, height: 500 },
  },
  {
    name: "Music",
    icon: MusicIcon,
    isResizable: true,
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

  const openApp = (appName: string) => {
    handleCurrentActiveApp(appName);
    setGlobalState((prevState) => ({
      ...prevState,
      activeApps: [...new Set([...prevState.activeApps, appName])],
    }));
  };

  const closeApp = (appName: string) => {
    setGlobalState((prevState) => ({
      ...prevState,
      activeApps: prevState.activeApps.filter((app) => app !== appName),
    }));
  };

  const minimizeApp = (appName: string) => {
    handleCurrentActiveApp(appName);
    console.log({appName,"minimizeApp":"a"});
  };

  const maximizeApp = (appName: string) => {
    handleCurrentActiveApp(appName);
    console.log(appName,"maximizeApp");
  };

  const state = useMemo(
    () => ({
      ...globalState,
      toggleTheme,
      openApp,
      closeApp,
      minimizeApp,
      maximizeApp,
      changeHomeWallpaper,
      changeLoginWallpaper,
    }),
    [toggleTheme, openApp, closeApp, changeHomeWallpaper, changeLoginWallpaper]
  );

  const handleCurrentActiveApp = (appName: string) => {
    const activeApp = state.apps.filter((app) => app.name === appName);
    setGlobalState((prev) => ({ ...prev, currentActiveApp: activeApp[0] }));
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
