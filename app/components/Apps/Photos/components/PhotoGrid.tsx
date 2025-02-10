import { WindowSizeProps } from "@/app/components/types";
import { Photo } from "./index";
import useGridClasses from "@/app/Hooks/useGridClasses";
import { CustomImage } from "@/app/components/System/Global";
import { BsDownload } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";

interface PhotoGridProps {
  photos: Photo[];
  windowSize: WindowSizeProps;
}

const gridRules = {
  photoContainer: {
    "col-span": {
      mobile: "6",
      tablet: "4",
      desktop: "3",
    },
  },
};

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, windowSize }) => {
  const { gridClasses } = useGridClasses(windowSize.windowSize, gridRules);

  const handleDownload = async (url: string, photographer: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `photo-by-${photographer}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="grid gap-2">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`${gridClasses.photoContainer} relative group`}
        >
          <div className="h-48 overflow-hidden relative">
            {!windowSize.isAppWindowResizing ? (
              <>
                <CustomImage
                  src={photo.src.original}
                  alt={photo.photographer}
                  className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IoMdPerson />
                    <p className="text-sm font-medium">{photo.photographer}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleDownload(photo.src.original, photo.photographer)
                    }
                    className="absolute top-2 right-2 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
                    <BsDownload />
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute bg-gray-400 w-full h-full" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
