import React, { useContext, useState } from "react";
import { useWatchlist } from "../contexts/WatchlistContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "../ui/Spinner";

function MovieCard({ movie }) {
  const { authState } = useContext(AuthContext);
  const { addWatchlist, removeWatchlist, watchlist, isUserVerified } =
    useWatchlist();
  const { addFavorites, removeFavorites, favorites } = useFavorites();

  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const isInWatchlist = watchlist.some((toWatch) => toWatch.id === movie.id);
  const isInFavorites = favorites.some((favorite) => favorite.id === movie.id);

  const handleWatchlistClick = async () => {
    setLoadingWatchlist(true);
    try {
      if (isInWatchlist) {
        await removeWatchlist(movie.id);
      } else {
        await addWatchlist(movie);
      }
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const handleFavoritesClick = async () => {
    setLoadingFavorites(true);
    try {
      if (isInFavorites) {
        await removeFavorites(movie.id);
      } else {
        await addFavorites(movie);
      }
    } finally {
      setLoadingFavorites(false);
    }
  };

  return (
    <div className="relative m-2 min-w-[220px] max-w-[220px] rounded-xl bg-gray-900 bg-opacity-60 p-4 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={moviePoster}
          alt={movie.title}
          className="w-full rounded-xl"
        />
      </Link>

      {/* Overlay for buttons */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black bg-opacity-0 transition-all hover:bg-opacity-50">
        {authState.isAuthenticated && isUserVerified && (
          <>
            {/* Watchlist Button */}
            <div className="pointer-events-auto absolute left-2 top-2 z-10">
              {loadingWatchlist ? (
                <Spinner type="mini" />
              ) : isInWatchlist ? (
                <button
                  onClick={handleWatchlistClick}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <FaBookmark size={24} />
                </button>
              ) : (
                <button
                  onClick={handleWatchlistClick}
                  className="text-gray-400 hover:text-yellow-300"
                >
                  <FaRegBookmark size={24} />
                </button>
              )}
            </div>

            {/* Favorites Button */}
            <div className="pointer-events-auto absolute right-2 top-2 z-20">
              {loadingFavorites ? (
                <Spinner type="mini" />
              ) : isInFavorites ? (
                <button
                  onClick={handleFavoritesClick}
                  className="text-red-500 hover:text-red-400"
                >
                  <FaHeart size={24} />
                </button>
              ) : (
                <button
                  onClick={handleFavoritesClick}
                  className="text-gray-400 hover:text-red-400"
                >
                  <FaRegHeart size={24} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Link to={`/movie/${movie.id}`}>
        <h2 className="mt-2 text-center text-sm font-medium text-white">
          {movie.title}
        </h2>
      </Link>

      <div className="mt-1 flex items-center justify-between">
        {movie.release_date && <span>📆 {movie.release_date.slice(0, 4)}</span>}
        <span className="inline-block rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
          ⭐ {movie.vote_average.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export default MovieCard;
