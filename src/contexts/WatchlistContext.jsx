import React, { createContext, useState, useContext } from "react";
import { fetchMovie } from "../services/apiMovies"; // Assuming your fetchMovie function is in this file

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  // Only store movie IDs in the state
  const [watchlist, setWatchlist] = useState([]);

  // Add movie ID to the watchlist
  const addToWatchlist = (movie) => {
    setWatchlist((prev) => [...prev, movie.id]);
  };

  // Remove movie ID from the watchlist
  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((movieId) => movieId !== id));
  };

  // Fetch all movies in the watchlist based on their IDs
  const getWatchlistMovies = async () => {
    const movies = await Promise.all(
      watchlist.map((id) => fetchMovie(id)), // Fetch each movie by its ID
    );
    return movies; // This returns an array of movie objects
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        getWatchlistMovies,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
