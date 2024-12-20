import { useContext, useEffect, useState } from "react";
import { BackDrop } from "../../Global";
import AppleLogo50 from "@/public/icons/apple50.png";
import Image from "next/image";
import { GlobalContext } from "@/app/contexts/GlobalContext";
import BatteryIcon from "@/public/icons/battery.png";
import BatteryChargeIcon from "@/public/icons/battery-charge.png";
import WifiIcon from "@/public/icons/wifi.png";
import FullScreenIcon from "@/public/icons/full-screen.png";

const TopBar: React.FC = () => {
  const context = useContext(GlobalContext);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [batteryPercentage, setBatteryPercentage] = useState<number | null>(
    null
  );
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getBatteryStatus();
  }, []);

  const getBatteryStatus = async () => {
    try {
      const battery = await (navigator as unknown as any).getBattery();
      if (battery) {
        setBatteryPercentage(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.onlevelchange = () =>
          setBatteryPercentage(Math.round(battery.level * 100));
        battery.onchargingchange = () => setIsCharging(battery.charging);
      }
    } catch (error) {
      console.error("Error fetching battery status", error);
    }
  };

  // Check online status and WiFi connection
  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !(document as unknown as any).mozFullScreenElement &&
      !(document as unknown as any).webkitFullscreenElement &&
      !(document as unknown as any).msFullscreenElement
    ) {
      // Enter fullscreen
      if ((document.documentElement as unknown as any).requestFullscreen) {
        (document.documentElement as unknown as any).requestFullscreen();
      } else if (
        (document.documentElement as unknown as any).mozRequestFullScreen
      ) {
        // Firefox
        (document.documentElement as unknown as any).mozRequestFullScreen();
      } else if (
        (document.documentElement as unknown as any).webkitRequestFullscreen
      ) {
        // Chrome, Safari, and Opera
        (document.documentElement as unknown as any).webkitRequestFullscreen();
      } else if (
        (document.documentElement as unknown as any).msRequestFullscreen
      ) {
        // IE/Edge
        (document.documentElement as unknown as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if ((document as unknown as any).exitFullscreen) {
        (document as unknown as any).exitFullscreen();
      } else if ((document as unknown as any).mozCancelFullScreen) {
        // Firefox
        (document as unknown as any).mozCancelFullScreen();
      } else if ((document as unknown as any).webkitExitFullscreen) {
        // Chrome, Safari, and Opera
        (document as unknown as any).webkitExitFullscreen();
      } else if ((document as unknown as any).msExitFullscreen) {
        // IE/Edge
        (document as unknown as any).msExitFullscreen();
      }
    }
  };

  return (
    <div className="w-full backdrop-blur-md text-black font-bold py-1 px-4 flex justify-between items-center fixed top-0 z-10">
      <BackDrop />
      <div className="flex items-center text-sm gap-x-2">
        <Image src={AppleLogo50} alt="Apple Logo" className="h-5 w-5" />
        <div className="flex items-center">
          {context?.activeApps?.map((app) => (
            <span
              key={app}
              className="mx-2 cursor-pointer"
              onDoubleClick={() => context?.closeApp(app)}
            >
              {app}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {batteryPercentage !== null && (
          <div className="flex items-center text-sm mx-2">
            {isCharging ? (
              <div className="mr-2">
                <Image
                  src={BatteryChargeIcon}
                  className="w-8 h-6"
                  alt="battery-charge"
                />
              </div>
            ) : (
              <div className="mr-2">
                <Image src={BatteryIcon} alt="battery" className="w-8 h-6" />
              </div>
            )}
            <span className="text-sm cursor-default">{batteryPercentage}%</span>
          </div>
        )}

        {isOnline && (
          <div className="mr-2">
            <Image src={WifiIcon} alt="Wifi" className="w-5 h-5" />
          </div>
        )}
        <div className="mr-1">
          <Image
            src={FullScreenIcon}
            alt="Wifi"
            onClick={toggleFullscreen}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
        <div className="text-sm cursor-default">{currentTime}</div>
      </div>
    </div>
  );
};

export default TopBar;
