interface DockProps {
  openApp: (appName: string) => void;
}

const Dock: React.FC<DockProps> = ({ openApp }) => {
  const apps = [
    { name: "Calculator", icon: "/calculator-icon.png" },
    { name: "Remuneration", icon: "/remuneration-icon.png" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-4 flex space-x-4">
      {apps.map((app) => (
        <button
          key={app.name}
          onClick={() => openApp(app.name)}
          className="w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-700"
        >
          <img src={app.icon} alt={`${app.name} icon`} className="w-8 h-8" />
        </button>
      ))}
    </div>
  );
};

export default Dock;
