"use client";
import React, { createContext, useState, ReactNode } from "react";
import wallpaper4 from "@/public/wallpapers/wallpaper4.jpg";
import wallpaper1 from "@/public/wallpapers/wallpaper1.jpg";
import calculatorIcon from "@/public/icons/calculator.png";
import TerminalIcon from "@/public/icons/terminal.png";
import PhotosIcon from "@/public/icons/photos.png";
import SettingsIcon from "@/public/icons/settings.png";
import CalenderIcon from "@/public/icons/calender.png";
import ContactsIcon from "@/public/icons/contacts.png";
import SafariIcon from "@/public/icons/safari.png";
import MusicIcon from "@/public/icons/music.png";

// Define the shape of the context
interface GlobalContextType {
  homePageWallpaper: string;
  loginPageWallpaper: string;
  theme: string;
  apps: AppInterface[];
  toggleTheme: () => void;
  activApps: string[];
  openApp: (appName: string) => void;
  closeApp: (appName: string) => void;
}

interface AppInterface {
  name: string;
  icon: string;
}

const apps = [
  { name: "Terminal", icon: TerminalIcon.src },
  { name: "Calculator", icon: calculatorIcon.src },
  { name: "Calender", icon: CalenderIcon.src },
  { name: "Settings", icon: SettingsIcon.src },
  { name: "Photos", icon: PhotosIcon.src },
  { name: "Safari", icon: SafariIcon.src },
  { name: "Contact", icon: ContactsIcon.src },
  { name: "Music", icon: MusicIcon.src },
];

// Create a Context with default values
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const initialState = {
  homePageWallpaper: wallpaper4.src,
  loginPageWallpaper: wallpaper1.src,
  theme: "light",
  apps: apps,
  activApps: [], // Always an array
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

  const openApp = (appName: string) => {
    setGlobalState((prevState: any) => ({
      ...prevState,
      activApps: [...new Set([...prevState.activApps, appName])],
    }));
  };

  const closeApp = (appName: string) => {
    setGlobalState((prevState) => ({
      ...prevState,
      activApps: prevState.activApps.filter((app) => app !== appName),
    }));
  };

  return (
    <GlobalContext.Provider
      value={{ ...globalState, toggleTheme, openApp, closeApp }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
