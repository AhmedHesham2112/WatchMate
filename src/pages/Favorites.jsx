import React, { useEffect, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import MovieCard from "../components/MovieCard";

const Favorites = () => {
  const { favorites, isLoading, error } = useFavorites();

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Favorite Movies</h1>
      <div className="min-h-screen p-5">
        {isLoading && <p>Loading your favorite movies...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Favorites;
