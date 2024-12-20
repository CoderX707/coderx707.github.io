import { useContext } from "react";
import { BackDrop } from "../../Global";
import { GlobalContext } from "@/app/contexts/GlobalContext";

const Dock: React.FC = () => {
  const context = useContext(GlobalContext);
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-sm rounded-xl shadow-lg p-4 flex space-x-4 z-10">
      <BackDrop radius="rounded-xl" />
      {context?.apps?.map((app) => (
        <button
          key={app.name}
          onClick={() => context.openApp(app.name)}
          className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-700"
        >
          <img src={app.icon} alt={`${app.name} icon`} className="w-12 h-12" />
        </button>
      ))}
    </div>
  );
};

export default Dock;
