"use client"
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {TopBar, AppWindow, Dock } from "@/app/components/System/Desktop";
import { Calculator, RemunerationDisplay } from "../Apps";

const HomeScreen: React.FC = () => {
  const [openApp, setOpenApp] = useState<string>("");

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white relative">
      <TopBar/>
      {/* Open Apps */}
      <AnimatePresence>
        {openApp === "Calculator" && (
          <AppWindow
            isOpen={true}
            onClose={() => setOpenApp("")}
            title="Calculator"
          >
            <Calculator />
          </AppWindow>
        )}
        {openApp === "Remuneration" && (
          <AppWindow
            isOpen={true}
            onClose={() => setOpenApp("")}
            title="Remuneration"
          >
            <RemunerationDisplay />
          </AppWindow>
        )}
      </AnimatePresence>

      {/* Dock */}
      <Dock openApp={setOpenApp} />
    </div>
  );
};

export default HomeScreen;
