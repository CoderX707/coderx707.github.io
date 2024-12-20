import { useState } from "react";

const Calculator = () => {
  const [display, setDisplay] = useState("");
  
  const handleClick = (value:any) => {
    if (value === "=") {
      try {
        setDisplay(eval(display).toString()); // Simple evaluation logic
      } catch {
        setDisplay("Error");
      }
    } else if (value === "C") {
      setDisplay("");
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md shadow-lg w-64">
      <div className="mb-4 p-2 bg-black text-right text-xl rounded-md">{display || "0"}</div>
      <div className="grid grid-cols-4 gap-2">
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"].map((key) => (
          <button
            key={key}
            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600"
            onClick={() => handleClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
