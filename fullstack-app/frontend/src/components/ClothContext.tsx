import { createContext, useEffect, PropsWithChildren, useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export type ClothingCategory = "top" | "bottom" | "outerwear" | "footwear" | "accessory";
export type SeasonTag = "spring" | "summer" | "fall" | "winter" | "all";

export interface ClothItem {
  _id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  size: string;
  season: SeasonTag;
  // brand: string;
  imageUrl?: string;
  notes?: string;
  favorite?: boolean;
}

export interface ClothContextType {
  clothes: ClothItem[];
  setClothes: (clothes: ClothItem[]) => void;
  isLoading: boolean;
  refreshClothes: () => Promise<void>;
}

export const ClothContext = createContext<ClothContextType>({
  clothes: [],
  setClothes: () => { },
  isLoading: true,
  refreshClothes: async () => { },
});

export function ClothContextProvider({ children }: PropsWithChildren) {
  const [clothes, setClothes] = useState<ClothItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id: ownerId } = useContext(UserContext);

  const fetchClothes = useCallback(async () => {
    if (!ownerId) {
      setClothes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get<ClothItem[]>("http://localhost:8000/items", {
        params: { owner_id: ownerId }
      });
      setClothes(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch clothes", error);
      setClothes([]);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchClothes();
  }, [fetchClothes]);//if we change to ownerId, it mean we will refetch clothes when ownerId changes

  return (
    <ClothContext.Provider value={{ clothes, setClothes, isLoading, refreshClothes: fetchClothes }}>
      {children}
    </ClothContext.Provider>
  );
}
