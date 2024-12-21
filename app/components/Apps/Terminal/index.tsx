import React, { useState } from "react";

const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [variables, setVariables] = useState<Map<string, any>>(new Map()); // Store variables

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleCommandSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const commandOutput = processCommand(input);
    setOutput((prevOutput) => [...prevOutput, `> ${input}`, commandOutput]);
    setInput(""); // Clear input field after command
  };

  const processCommand = (command: string): string => {
    if (command.startsWith("let") || command.startsWith("var")) {
      // Handle variable assignment commands
      try {
        const variableDeclaration = command.slice(command.indexOf(" ") + 1); // Remove `let` or `var`
        const [varName, ...expression] = variableDeclaration.split("=");
        const value = eval(expression.join("=")); // Evaluate the expression for the value
        setVariables(new Map(variables.set(varName.trim(), value))); // Store the variable
        return `Variable '${varName.trim()}' set to ${value}`;
      } catch (error) {
        return `Error: ${(error as Error).message}`;
      }
    } else if (command.startsWith("echo")) {
      return command.slice(5); // Output the rest of the command after `echo`
    } else if (command === "clear") {
      setOutput([]);
      return "";
    } else if (command === "help") {
      return "Available commands: help, echo, clear, let <variable> = <value>, var <variable> = <value>, and JavaScript expressions.";
    } else if (command.startsWith("console.log")) {
      try {
        const expression = command.slice(12).trim(); // Remove `console.log`
        const result = eval(expression); // Evaluate the expression
        return result.toString(); // Return the result
      } catch (error) {
        return `Error: ${(error as Error).message}`;
      }
    } else if (command.trim()) {
      try {
        // Handle JavaScript expressions (checking for variables first)
        const processedCommand = processVariables(command);
        const result = eval(processedCommand); // Evaluate the processed expression
        return result.toString();
      } catch (error) {
        return `Error: ${(error as Error).message}`;
      }
    } else {
      return `Command not found: ${command}`;
    }
  };

  const processVariables = (command: string): string => {
    let processedCommand = command;

    // Replace variables with their values
    variables.forEach((value, key) => {
      processedCommand = processedCommand.replace(
        new RegExp(`\\b${key}\\b`, "g"),
        value
      );
    });

    return processedCommand;
  };

  return (
    <div className="text-green-400 p-1 font-mono min-h-[260px] overflow-y-auto">
      <div className="mb-0">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommandSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="bg-transparent text-green-400 bg-black/20 border-none outline-none w-full p-1 font-mono"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;
