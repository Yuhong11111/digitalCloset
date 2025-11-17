import { useContext } from "react";
import { ClothContext } from "../components/ClothContext";

export const useClothContext = () => {
  const ctx = useContext(ClothContext);
  if (!ctx) {
    throw new Error("useClothContext must be used within a ClothContextProvider");
  }
  return ctx;
};

