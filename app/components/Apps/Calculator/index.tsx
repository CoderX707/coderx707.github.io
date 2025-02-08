import { WindowSizeProps } from "../../types";
import { useState } from "react";

const Calculator = ({ windowSize }: WindowSizeProps) => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
    switch (operator) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "×":
        return firstOperand * secondOperand;
      case "÷":
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const resetCalculator = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const handleEquals = () => {
    if (operator === null || firstOperand === null) return;
    
    const secondOperand = parseFloat(display);
    const result = calculate(firstOperand, secondOperand, operator);
    
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex bg-gray-800 text-white p-4 flex-col">
        <div className="bg-gray-900 p-4 mb-4 text-right text-3xl rounded">
          {display}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex-1" onClick={resetCalculator}>
              AC
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex-1" onClick={toggleSign}>
              +/-
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 rounded p-2 flex-1" onClick={handlePercent}>
              %
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 rounded p-2 flex-1" onClick={() => handleOperator("÷")}>
              ÷
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("7")}>
              7
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("8")}>
              8
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("9")}>
              9
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 rounded p-2 flex-1" onClick={() => handleOperator("×")}>
              ×
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("4")}>
              4
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("5")}>
              5
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("6")}>
              6
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 rounded p-2 flex-1" onClick={() => handleOperator("-")}>
              -
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("1")}>
              1
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("2")}>
              2
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("3")}>
              3
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 rounded p-2 flex-1" onClick={() => handleOperator("+")}>
              +
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={() => inputDigit("0")}>
              0
            </button>
            <button className="bg-gray-600 hover:bg-gray-500 rounded p-2 flex-1" onClick={inputDecimal}>
              .
            </button>
            <button className="bg-orange-500 hover:bg-orange-400 rounded p-2 flex-1" onClick={handleEquals}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
