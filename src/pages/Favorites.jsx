import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import MovieCard from "../components/MovieCard";

const Favorites = () => {
  const { favorites, isLoading, error } = useFavorites();

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Favorite Movies</h1>
      <div className="min-h-screen p-5">
        {isLoading && <p>Loading your favorite movies...</p>}
        {error !== "" && <p>Add movies to your Favorites</p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Favorites;
