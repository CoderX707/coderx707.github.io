import { useContext, useEffect, useState } from "react";
import { BackDrop } from "../../Global";
import { GlobalContext } from "@/app/contexts/GlobalContext";
import WifiIcon from "@/public/icons/wifi.png";
import screenfull from "screenfull";
import { VscTerminalLinux } from "react-icons/vsc";
import { FaWifi } from "react-icons/fa";
import { RiFullscreenLine } from "react-icons/ri";
import { BsBatteryHalf } from "react-icons/bs";
import { BsBatteryFull } from "react-icons/bs";
import { BsBatteryCharging } from "react-icons/bs";
import { BsBattery } from "react-icons/bs";

const TopBar: React.FC = () => {
  const context = useContext(GlobalContext);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [batteryPercentage, setBatteryPercentage] = useState<number | null>(
    null
  );
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const battery = await (navigator as unknown as any)?.getBattery();
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
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  };

  return (
    <div className="w-full backdrop-blur-md text-black font-bold py-1 px-2 flex justify-between items-center fixed top-0 z-10">
      <BackDrop />
      <div className="flex items-center text-sm gap-x-2">
        <VscTerminalLinux size={24} />
        <div className="flex items-center">
          {context?.activeApps?.map((app) => (
            <span
              key={app.name}
              className="mx-2 cursor-pointer"
              onDoubleClick={() => context?.closeApp(app)}
            >
              {app.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {batteryPercentage !== null && (
          <div className="flex items-center text-sm mx-2">
            <div className="mr-2">
              {isCharging ? (
                <BsBatteryCharging size={22} />
              ) : batteryPercentage <= 30 ? (
                <BsBattery size={22} />
              ) : batteryPercentage > 30 && batteryPercentage < 70 ? (
                <BsBatteryHalf size={22} />
              ) : (
                <BsBatteryFull size={22} />
              )}
            </div>
            <span className="text-sm cursor-default">{batteryPercentage}%</span>
          </div>
        )}

        {isOnline && (
          <div className="mr-2">
            <FaWifi size={22} />
          </div>
        )}
        <div className="mr-1">
          <RiFullscreenLine
            size={22}
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
