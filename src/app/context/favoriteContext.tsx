"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Book = {
  key: string;
  title: string;
  authors?: { author: { key: string } }[];
  description?: string;
  published_date?: string;
  subjects?: string[];
  covers?: number[];
};

const FavoritesContext = createContext<{
  favorites: Book[];
  addFavorite: (book: Book) => void;
  removeFavorite: (book: Book) => void;
}>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Book[]>(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  const addFavorite = (book: Book) => {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, book];

      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      return updatedFavorites;
    });
  };

  const removeFavorite = (book: Book) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((b) => b.key !== book.key);

      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }

      return updatedFavorites;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
