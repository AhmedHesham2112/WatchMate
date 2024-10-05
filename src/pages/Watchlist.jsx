import React, { useEffect, useState } from "react";
import { useWatchlist } from "../contexts/WatchlistContext"; // Path to your context
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const { getWatchlistMovies } = useWatchlist();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const watchlistMovies = await getWatchlistMovies();
        setMovies(watchlistMovies);
      } catch (error) {
        console.error("Failed to fetch watchlist movies:", error);
      }
    };

    fetchMovies();
  }, [getWatchlistMovies]);

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Popular Movies</h1>
      <div className="min-h-screen p-5">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Watchlist;
