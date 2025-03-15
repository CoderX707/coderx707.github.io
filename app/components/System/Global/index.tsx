import Image from "next/image";
import WorkingIcon from "@/public/icons/working.png";
import { FC, memo, useState } from "react";
import { IconType } from "react-icons/lib";
interface BackDropInterface {
  color?: "black" | "white";
  blur?: "sm" | "md" | "xl";
  radius?: string;
}

export const BackDrop = memo(
  ({ color = "black", blur = "sm", radius = "" }: BackDropInterface) => {
    return (
      <div
        className={`absolute inset-0 backdrop-blur-${blur} bg-${color}/30 ${radius}`}
        style={{
          zIndex: -1,
        }}
      />
    );
  }
);
BackDrop.displayName = "BackDrop";

export const WorkingOn = memo(() => {
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
});
WorkingOn.displayName = "WorkingOn";

export const CustomImage = memo(
  ({
    src = WorkingIcon,
    alt = "SSOVEE Image",
    fallbackImage = WorkingIcon,
    placeholderImage = WorkingIcon?.blurDataURL,
    ...props
  }: any) => {
    // State for error handling
    const [hasError, setHasError] = useState(false);
    // Handle image error (e.g., when the image path doesn't exist)
    const handleError = () => {
      setHasError(true);
    };

    return (
      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        fill
        loading="eager"
        placeholder="blur"
        blurDataURL={
          src?.blurDataURL ? src.blurDataURL : placeholderImage || null
        }
        onError={handleError}
        {...props} // Spread remaining props to pass to next/image
      />
    );
  }
);
CustomImage.displayName = "CustomImage";

interface AnimatedIconProps {
  icon: IconType; // IconType from react-icons
  size?: number;
  className?: string;
  iconColor?: string;
  bgHoverColor?: string;
}

export const AnimatedIcon: FC<AnimatedIconProps> = ({
  icon: IconComponent,
  size = 24,
  className = "",
  iconColor = "while",
  bgHoverColor = "bg-black",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-2 transition-transform cursor-pointer transform rounded-md hover:${bgHoverColor} hover:scale-110 ${className}`}
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      <IconComponent size={size} color={iconColor} />
    </div>
  );
};
