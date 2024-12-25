import React, { useReducer, useEffect, ReactElement } from "react";
import { BackDrop } from "../../Global";
import { WindowSizeProps } from "@/app/components/types";

interface AppWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactElement<WindowSizeProps>;
}

interface State {
  position: { x: number; y: number };
  isDragging: boolean;
  startPos: { x: number; y: number };
  isMinimized: boolean;
  isMaximized: boolean;
  windowSize: { width: number; height: number };
  resizeStart: { x: number; y: number } | null;
  initialSize: { width: number; height: number };
}

type Action =
  | { type: "START_DRAG"; payload: { x: number; y: number } }
  | { type: "DRAG"; payload: { x: number; y: number } }
  | { type: "STOP_DRAG" }
  | { type: "START_RESIZE"; payload: { x: number; y: number } }
  | { type: "RESIZE"; payload: { width: number; height: number } }
  | { type: "STOP_RESIZE" }
  | { type: "TOGGLE_MINIMIZE" }
  | { type: "TOGGLE_MAXIMIZE"; payload?: { width: number; height: number } };

const initialState: State = {
  position: { x: 100, y: 100 },
  isDragging: false,
  startPos: { x: 0, y: 0 },
  isMinimized: false,
  isMaximized: false,
  windowSize: { width: 400, height: 300 },
  resizeStart: null,
  initialSize: { width: 400, height: 300 },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_DRAG":
      return { ...state, isDragging: true, startPos: action.payload };
    case "DRAG":
      return { ...state, position: action.payload };
    case "STOP_DRAG":
      return { ...state, isDragging: false };
    case "START_RESIZE":
      return {
        ...state,
        resizeStart: action.payload,
        initialSize: state.windowSize,
      };
    case "RESIZE":
      return { ...state, windowSize: action.payload };
    case "STOP_RESIZE":
      return { ...state, resizeStart: null };
    case "TOGGLE_MINIMIZE":
      return {
        ...state,
        isMinimized: !state.isMinimized,
        windowSize: {
          ...state.windowSize,
          height: state.isMinimized ? 300 : 33,
        },
      };
    case "TOGGLE_MAXIMIZE":
      if (state.isMaximized) {
        return {
          ...state,
          isMaximized: false,
          windowSize: { width: 400, height: 300 },
          position: { x: 100, y: 100 },
        };
      }
      return {
        ...state,
        isMaximized: true,
        windowSize: action.payload || state.windowSize,
        position: { x: 0, y: 0 },
      };
    default:
      return state;
  }
};

const AppWindow: React.FC<AppWindowProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Handle Mouse Events for Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (state.isMaximized) return;
    dispatch({
      type: "START_DRAG",
      payload: {
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y,
      },
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (state.isDragging) {
      const newX = e.clientX - state.startPos.x;
      const newY = e.clientY - state.startPos.y;

      const boundedX = Math.max(
        0,
        Math.min(newX, window.innerWidth - state.windowSize.width)
      );
      const boundedY = Math.max(
        0,
        Math.min(newY, window.innerHeight - state.windowSize.height)
      );

      dispatch({ type: "DRAG", payload: { x: boundedX, y: boundedY } });
    }

    if (state.resizeStart) {
      const newWidth =
        state.initialSize.width + (e.clientX - state.resizeStart.x);
      const newHeight =
        state.initialSize.height + (e.clientY - state.resizeStart.y);

      dispatch({
        type: "RESIZE",
        payload: {
          width: Math.max(
            200,
            Math.min(newWidth, window.innerWidth - state.position.x)
          ),
          height: Math.max(
            100,
            Math.min(newHeight, window.innerHeight - state.position.y)
          ),
        },
      });
    }
  };

  const handleMouseUp = () => {
    if (state.isDragging) dispatch({ type: "STOP_DRAG" });
    if (state.resizeStart) dispatch({ type: "STOP_RESIZE" });
  };

  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    dispatch({ type: "START_RESIZE", payload: { x: e.clientX, y: e.clientY } });
  };

  useEffect(() => {
    if (state.isDragging || state.resizeStart) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [state.isDragging, state.resizeStart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed rounded shadow-lg backdrop-blur-md bg-black/10 z-10"
      style={{
        width: `${state.windowSize.width}px`,
        height: `${state.windowSize.height}px`,
        transform: state.isMaximized
          ? undefined
          : `translate(${state.position.x}px, ${state.position.y}px)`,
        overflow: state.isMinimized ? "hidden" : "auto",
      }}
    >
      <BackDrop />

      {/* Title Bar */}
      <div
        className="flex justify-between items-center backdrop-blur-md px-4 py-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex space-x-2">
          <button
            className="bg-red-600 rounded-full w-4 h-4"
            onClick={onClose}
            title="Close"
          />
          <button
            className="bg-yellow-400 rounded-full w-4 h-4"
            onClick={() => dispatch({ type: "TOGGLE_MINIMIZE" })}
            title="Minimize"
          />
          <button
            className="bg-green-500 rounded-full w-4 h-4"
            onClick={() =>
              dispatch({
                type: "TOGGLE_MAXIMIZE",
                payload: {
                  width: window.innerWidth,
                  height: window.innerHeight,
                },
              })
            }
            title={state.isMaximized ? "Restore" : "Maximize"}
          />
        </div>
      </div>

      {/* App Content */}
      {!state.isMinimized && (
        <div style={{ maxHeight: "calc(100% - 32px)", overflowY: "auto" }}>
          {React.cloneElement(children, {
            windowSize: state.windowSize,
          })}
        </div>
      )}

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default AppWindow;
