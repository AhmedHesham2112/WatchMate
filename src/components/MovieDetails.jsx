import React, { useContext } from "react";
import useMovieDetails from "./useMovieDetails";
import { useParams } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useWatchlist } from "../contexts/WatchlistContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { AuthContext } from "../contexts/AuthContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

function MovieDetails() {
  const { authState } = useContext(AuthContext);
  const { id } = useParams();
  const { movieDetails, isLoading, error } = useMovieDetails(id);
  const {
    addWatchlist,
    removeWatchlist,
    watchlist,
    isLoading: isLoadingWatchlist,
  } = useWatchlist();
  const {
    addFavorites,
    removeFavorites,
    favorites,
    isLoading: isLoadingFavorites,
  } = useFavorites();

  const isInWatchlist = movieDetails
    ? watchlist.some((toWatch) => toWatch.id === movieDetails.id)
    : false;
  const isInFavorites = movieDetails
    ? favorites.some((favorite) => favorite.id === movieDetails.id)
    : false;

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Hero Section with Poster */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path || movieDetails.poster_path}`}
          alt={movieDetails.title}
          className="h-full w-full object-cover brightness-50 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
          <p className="mt-2 text-lg">
            <span className="font-semibold">Rating:</span> ⭐{" "}
            {movieDetails.vote_average.toFixed(1)}/10
          </p>
          <p className="text-lg">
            <span className="font-semibold">Release Date:</span>{" "}
            {movieDetails.release_date}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Runtime:</span>{" "}
            {movieDetails.runtime} min
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="relative z-10 mt-10 w-full max-w-4xl rounded-lg bg-gray-900 bg-opacity-80 p-8 shadow-lg">
        <p className="mb-6 text-lg leading-relaxed text-white">
          {movieDetails.overview}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Genres: </span>
          {movieDetails.genres.map((genre) => genre.name).join(", ")}
        </p>

        {authState.isAuthenticated && (
          <div className="mt-4 flex justify-between">
            {/* Watchlist Button */}
            {isLoadingWatchlist ? (
              <Spinner type="mini" />
            ) : isInWatchlist ? (
              <button
                onClick={() => removeWatchlist(movieDetails.id)}
                className="flex items-center gap-1 text-yellow-500 transition hover:text-yellow-400"
              >
                <FaBookmark size={24} /> Remove from Watchlist
              </button>
            ) : (
              <button
                onClick={() => addWatchlist(movieDetails)}
                className="flex items-center gap-1 text-gray-400 transition hover:text-yellow-300"
              >
                <FaRegBookmark size={24} /> Add to Watchlist
              </button>
            )}

            {/* Favorites Button */}
            {isLoadingFavorites ? (
              <Spinner type="mini" />
            ) : isInFavorites ? (
              <button
                onClick={() => removeFavorites(movieDetails.id)}
                className="flex items-center gap-1 text-red-500 transition hover:text-red-400"
              >
                <FaHeart size={24} /> Remove from Favorites
              </button>
            ) : (
              <button
                onClick={() => addFavorites(movieDetails)}
                className="flex items-center gap-1 text-gray-400 transition hover:text-red-400"
              >
                <FaRegHeart size={24} /> Add to Favorites
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
