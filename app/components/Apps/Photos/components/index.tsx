import { WindowSizeProps } from "@/app/components/types";
import Pagination from "./Pagination";
import PhotoGrid from "./PhotoGrid";
import SearchBar from "./SearchBar";

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string | null;
  avg_color: string | null;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  liked: boolean;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export interface PhotosProps {
  photos: Photo[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  windowSize: Readonly<WindowSizeProps>;
}

const PhotosApp: React.FC<PhotosProps> = ({
  photos,
  loading,
  currentPage,
  totalPages,
  searchQuery,
  onSearch,
  onPageChange,
  windowSize,
}) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <SearchBar onSearch={onSearch} initialQuery={searchQuery} />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <>
            <PhotoGrid photos={photos} windowSize={windowSize} />
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotosApp;
