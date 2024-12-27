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
  openApp: (appName: string) => void;
  closeApp: (appName: string) => void;
  changeHomeWallpaper: (wallpaper: string) => void;
  changeLoginWallpaper: (wallpaper: string) => void;
  availableWallpapers: StaticImageData[];
}

interface AppInterface {
  name: string;
  icon: StaticImageData;
}

const apps = [
  { name: "Terminal", icon: TerminalIcon },
  { name: "Calculator", icon: calculatorIcon },
  { name: "Calender", icon: CalenderIcon },
  { name: "Settings", icon: SettingsIcon },
  { name: "Photos", icon: PhotosIcon },
  { name: "Safari", icon: SafariIcon },
  { name: "Contact", icon: ContactsIcon },
  { name: "Music", icon: MusicIcon },
];

// Create a Context with default values
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const initialState: Omit<
  GlobalContextType,
  | "toggleTheme"
  | "openApp"
  | "closeApp"
  | "changeHomeWallpaper"
  | "changeLoginWallpaper"
> = {
  homePageActiveWallpaper: wallpaper4.src,
  loginPageActiveWallpaper: wallpaper1.src,
  theme: "light",
  apps: apps,
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

  const state = useMemo(
    () => ({
      ...globalState,
      toggleTheme,
      openApp,
      closeApp,
      changeHomeWallpaper,
      changeLoginWallpaper,
    }),
    [
      toggleTheme,
      openApp,
      closeApp,
      changeHomeWallpaper,
      changeLoginWallpaper,
    ]
  );

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
