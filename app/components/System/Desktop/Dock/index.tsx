import { useContext } from "react";
import { AnimatedIcon, BackDrop } from "../../Global";
import { GlobalContext } from "@/app/contexts/GlobalContext";

const Dock: React.FC = () => {
  const context = useContext(GlobalContext);
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-sm rounded-xl shadow-lg p-4 flex z-10">
      <BackDrop radius="rounded-xl" />
      {context?.apps?.map((app) => (
        <button key={app.name} onClick={() => context.openApp(app)} className="mx-1">
          <AnimatedIcon
            icon={app.icon}
            size={32}
            iconColor="white"
            bgHoverColor="bg-gray-700"
          />
        </button>
      ))}
    </div>
  );
};

export default Dock;
