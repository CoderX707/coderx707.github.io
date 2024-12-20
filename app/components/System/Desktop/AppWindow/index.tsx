import React, { useState, useEffect } from "react";
import { BackDrop } from "../../Global";

interface AppWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 400, height: 300 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMaximized) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const appWidth = windowSize.width;
    const appHeight = windowSize.height;

    // Enforce boundaries
    const boundedX = Math.max(0, Math.min(newX, windowWidth - appWidth));
    const boundedY = Math.max(0, Math.min(newY, windowHeight - appHeight));

    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMinimize = () => {
    setWindowSize({ width: 400, height: !isMinimized ? 40 : 300 });
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore original size and position
      setWindowSize({ width: 400, height: 300 });
      setPosition({ x: 100, y: 100 });
    } else {
      // Maximize to full screen
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null; // Ensure the window is only visible if isOpen is true

  return (
    <div
      className="fixed rounded shadow-lg backdrop-blur-md bg-black/10 block z-0"
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        transform: isMaximized
          ? undefined
          : `translate(${position.x}px, ${position.y}px)`,
        overflow: isMinimized ? "hidden" : "auto",
      }}
    >
      <BackDrop />

      {/* Title Bar */}
      <div
        className="flex justify-between items-center backdrop-blur-md px-4 py-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
      <BackDrop />

        <span>{title}</span>
        <div className="flex space-x-2">
          <button
            className="bg-red-600 rounded-full w-4 h-4"
            onClick={onClose}
            title="Close"
          />
          <button
            className="bg-yellow-400 rounded-full w-4 h-4"
            onClick={handleMinimize}
            title="Minimize"
          />
          <button
            className="bg-green-500 rounded-full w-4 h-4"
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
          />
        </div>
      </div>

      {/* App Content */}
      {!isMinimized && (
        <div
          style={{ maxHeight: "calc(100% - 40px)", overflowY: "auto" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AppWindow;
