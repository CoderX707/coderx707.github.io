interface BackDropInterface {
  color: "black" | "white";
  blur: "sm" | "md" | "xl";
  radius: string;
}

export const BackDrop = ({ color = "black", blur = "sm", radius = "" }) => {
  return (
    <div
      className={`absolute inset-0 backdrop-blur-${blur} bg-${color}/30 ${radius}`}
      style={{
        zIndex: -1,
      }}
    />
  );
};
