import { createContext, useEffect, PropsWithChildren, useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { API_BASE_URL } from "../config";

export type ClothingCategory = "top" | "bottom" | "outerwear" | "footwear" | "accessory" | "others" | "dress";
export type SeasonTag = "spring" | "summer" | "fall" | "winter" | "all";

export interface ClothItem {
  _id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  season: SeasonTag;
  imageUrl?: string;
  notes?: string;
  favorite?: boolean;
  tags?: string[];
  size?: string;
  material?: string;
  brand?: string;
  purchase_price?: number;
  wear_count?: number;
  last_worn_at?: string;
  created_at?: string;
}

export interface ClothContextType {
  clothes: ClothItem[];
  setClothes: (clothes: ClothItem[]) => void;
  isLoading: boolean;
  refreshClothes: (options?: { page?: number; pageSize?: number; search?: string; filter?: string; sort?: string }) => Promise<void>;
  page: number;
  pageSize: number;
  total: number;
}

export const ClothContext = createContext<ClothContextType>({
  clothes: [],
  setClothes: () => { },
  isLoading: true,
  refreshClothes: async () => { },
  page: 1,
  pageSize: 12,
  total: 0,
});

export function ClothContextProvider({ children }: PropsWithChildren) {
  const [clothes, setClothes] = useState<ClothItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const { id: ownerId } = useContext(UserContext);

  const fetchClothes = useCallback(async (options?: { page?: number; pageSize?: number; search?: string; filter?: string; sort?: string }) => {
    if (!ownerId) {
      setClothes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const nextPage = options?.page ?? page; //Use the left value unless it’s null or undefined
      const nextPageSize = options?.pageSize ?? pageSize;
      // axios request to fetch clothes, typing the response data as an object with items array of ClothItem, page number, page_size number, total number in <{}>
      const response = await axios.get<{ items: ClothItem[]; page: number; page_size: number; total: number }>(
        `${API_BASE_URL}/items`,
        // query params passing in url with page, page_size, search, filter
        // When you use params in Axios, you are always sending data via the URL query string.
        {
          params: {
            page: nextPage,
            page_size: nextPageSize,
            ...(options?.search ? { search: options.search } : {}),
            ...(options?.filter ? { filter: options.filter } : {}),
            ...(options?.sort ? { sort: options.sort } : {}),
          },
        }
      );
      setClothes(response.data.items ?? []);
      setPage(response.data.page ?? nextPage);
      setPageSize(response.data.page_size ?? nextPageSize);
      setTotal(response.data.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch clothes", error);
      setClothes([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId, page, pageSize]);

  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);//if we change to ownerId, it mean we will refetch clothes when ownerId changes

  return (
    <ClothContext.Provider value={{ clothes, setClothes, isLoading, refreshClothes: fetchClothes, page, pageSize, total }}>
      {children}
    </ClothContext.Provider>
  );
}
