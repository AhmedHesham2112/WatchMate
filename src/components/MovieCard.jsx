import React from "react";
import { useWatchlist } from "../contexts/WatchlistContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist();

  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // Check if the movie is already in the watchlist
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  return (
    <div className="m-2 min-w-[200px] max-w-[200px] rounded-lg border border-gray-400 bg-gray-900 bg-opacity-60 p-2 shadow-lg transition-transform hover:scale-105">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={moviePoster}
          alt={movie.title}
          className="h-auto w-full rounded-lg"
        />
      </Link>
      <h2 className="mt-2 text-center text-sm font-semibold">{movie.title}</h2>

      {/* Improved Rating */}
      <div className="mt-2 flex items-center justify-center">
        <span className="inline-block rounded-full bg-green-800 px-2 py-1 text-xs font-bold text-white">
          ⭐ {movie.vote_average.toFixed(1)}
        </span>
      </div>

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
            className="flex items-center gap-1 text-gray-400"
          >
            <FaRegBookmark /> Add
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
