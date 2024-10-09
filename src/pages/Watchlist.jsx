import React from "react";
import { useWatchlist } from "../contexts/WatchlistContext";
import MovieCard from "../components/MovieCard";
import Spinner from "../ui/Spinner";

const Watchlist = () => {
  const { watchlist, isLoading, error } = useWatchlist();

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Watchlist Movies</h1>
      <div className="min-h-screen p-5">
        {isLoading && <Spinner />}
        {error !== "" && <p>Add movies to your Watchlist</p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Watchlist;
