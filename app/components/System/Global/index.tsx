import Image from "next/image";
import WorkingIcon from "@/public/icons/working.png";
interface BackDropInterface {
  color?: "black" | "white";
  blur?: "sm" | "md" | "xl";
  radius?: string;
}

export const BackDrop = ({
  color = "black",
  blur = "sm",
  radius = "",
}: BackDropInterface) => {
  return (
    <div
      className={`absolute inset-0 backdrop-blur-${blur} bg-${color}/30 ${radius}`}
      style={{
        zIndex: -1,
      }}
    />
  );
};

export const WorkingOn = () => {
  return (
    <div className="relative w-full h-[268px]">
      <Image
        src={WorkingIcon}
        width={400}
        height={295}
        alt="Working on"
        className="object-cover w-full h-full"
      />
      <div
        className={`absolute inset-0 bg-black opacity-50 flex justify-center items-center`}
      >
        <span className="text-white text-3xl font-bold">Coming Soon</span>
      </div>
    </div>
  );
};
