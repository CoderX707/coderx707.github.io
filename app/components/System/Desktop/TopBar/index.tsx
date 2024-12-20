import { useEffect, useState } from "react";

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

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

  return (
    <div className="w-full bg-gray-800 text-white py-1 px-4 flex justify-between items-center fixed top-0">
      <div className="text-sm">100% | Wi-Fi</div>
      <div className="text-sm">{currentTime}</div>
    </div>
  );
};

export default TopBar;
