import React, { createContext, useState, useContext } from "react";
import { fetchMovie } from "../services/apiMovies"; // Assuming your fetchMovie function is in this file

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Only store movie IDs in the state
  const [favorites, setFavorites] = useState([]);

  // Add movie ID to the favorites
  const addToFavorites = (movie) => {
    setFavorites((prev) => [...prev, movie.id]);
  };

  // Remove movie ID from the favorites
  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((movieId) => movieId !== id));
  };

  // Fetch all movies in the favorites based on their IDs
  const getFavoritesMovies = async () => {
    const movies = await Promise.all(
      favorites.map((id) => fetchMovie(id)), // Fetch each movie by its ID
    );
    return movies; // This returns an array of movie objects
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        getFavoritesMovies,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
