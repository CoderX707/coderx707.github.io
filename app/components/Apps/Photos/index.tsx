import { useEffect, useReducer } from "react";
import { createClient } from "pexels";
import PhotosApp, { Photo } from "./components";
import { WindowSizeProps } from "../../types";

const PEXELS_API_KEY =
  "Kslpmsb5m47k1nawHWMuBobWE12Q1JZ6nzIbfie5yugkUb0JHihTEd71";
const client = createClient(PEXELS_API_KEY);

const PER_PAGE = 10;

interface State {
  photos: Photo[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PHOTOS"; payload: { photos: Photo[]; totalResults: number } }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_PAGE"; payload: number };

const initialState: State = {
  photos: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  searchQuery: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PHOTOS":
      return {
        ...state,
        photos: action.payload.photos,
        totalPages: Math.ceil(action.payload.totalResults / PER_PAGE),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

export default function Photos(props: WindowSizeProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPhotos = async (query: string, page: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await client.photos.search({
        query: query || "nature",
        page,
        per_page: PER_PAGE,
      });

      if ("photos" in response) {
        dispatch({
          type: "SET_PHOTOS",
          payload: {
            photos: response.photos || [],
            totalResults: response.total_results,
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchPhotos(state.searchQuery, state.currentPage);
  }, [state.searchQuery, state.currentPage]);

  const handleSearch = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  return (
    <PhotosApp
      photos={state.photos}
      loading={state.loading}
      currentPage={state.currentPage}
      totalPages={state.totalPages}
      searchQuery={state.searchQuery}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      windowSize={props}
    />
  );
}
