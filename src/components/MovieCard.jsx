import React from "react";
import { useWatchlist } from "../contexts/WatchlistContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist();

  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // Check if the movie is already in the watchlist
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  return (
    <div className="m-2 min-w-[200px] max-w-[200px] rounded-lg border border-gray-200 p-2 shadow-lg">
      <img
        src={moviePoster}
        alt={movie.title}
        className="h-auto w-full rounded-lg"
      />
      <h2 className="mt-2 text-center text-sm">{movie.title}</h2>
      <div className="mt-2 flex justify-center gap-2">
        {isInWatchlist ? (
          <button
            onClick={() => removeFromWatchlist(movie.id)}
            className="flex items-center gap-1 text-yellow-500"
          >
            <FaBookmark /> Remove
          </button>
        ) : (
          <button
            onClick={() => addToWatchlist(movie)}
            className="flex items-center gap-1 text-gray-600"
          >
            <FaRegBookmark /> Add
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
