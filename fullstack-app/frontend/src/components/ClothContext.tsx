import { createContext, useEffect, PropsWithChildren, useState } from "react";
import axios from "axios";

export type ClothingCategory = "top" | "bottom" | "outerwear" | "footwear" | "accessory";
export type SeasonTag = "spring" | "summer" | "fall" | "winter" | "all";

export interface ClothItem {
  id: string;
  category: ClothingCategory;
  color: string;
  size: string;
  season: SeasonTag;
  // brand: string;
  imageUrl?: string;
  description?: string;
  favirite?: boolean;
}

export interface ClothContextType {
  clothes: ClothItem[];
  setClothes: (clothes: ClothItem[]) => void; //setItems is a function that accepts a list of clothing items and doesn’t return anything
}

export const ClothContext = createContext<ClothContextType>({
  clothes: [],
  setClothes: () => { },
});

export function ClothContextProvider({ children }: PropsWithChildren) {
  const [clothes, setClothes] = useState<ClothItem[]>([]);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get<ClothItem[]>('/items'); //the response data is expected to be a list of ClothItem objects
        setClothes(response.data);
      } catch (error) {
        console.error('Failed to fetch clothes', error);
      }
    };

    fetchClothes();
  }, []);
  return (
    <ClothContext.Provider value={{ clothes: [], setClothes: () => { } }}>
      {children}
    </ClothContext.Provider>
  );
}