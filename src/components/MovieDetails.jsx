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
  const { id } = useParams(); // Get the movie ID from the URL
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

  const isInWatchlist = watchlist.some(
    (toWatch) => toWatch.id === movieDetails.id,
  );
  const isInFavorites = favorites.some(
    (favorite) => favorite.id === movieDetails.id,
  );

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center px-5 py-10">
      <div className="bg-gray-950shadow-lg w-full max-w-4xl overflow-hidden rounded-lg border border-gray-400 bg-opacity-60">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {/* Movie Poster */}
          <div className="col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Details */}
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <h1 className="mb-4 text-3xl font-bold">{movieDetails.title}</h1>
              <p className="mb-2 text-lg">
                <span className="font-semibold">Release Date: </span>
                {movieDetails.release_date}
              </p>
              <p className="mb-4 text-lg">
                <span className="font-semibold">Rating: </span>
                {movieDetails.vote_average}/10
              </p>
              <p className="mb-6 leading-relaxed">{movieDetails.overview}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg">
                <span className="font-semibold">Runtime: </span>
                {movieDetails.runtime} minutes
              </p>
              <p className="text-lg">
                <span className="font-semibold">Genres: </span>
                {movieDetails.genres.map((genre) => genre.name).join(", ")}
              </p>
              {authState.isAuthenticated && (
                <>
                  {/* Watchlist Button */}
                  {isLoadingWatchlist ? (
                    <Spinner type="mini" />
                  ) : (
                    <div className="mt-2 flex justify-center gap-2">
                      {isInWatchlist ? (
                        <button
                          onClick={() => removeWatchlist(movieDetails.id)}
                          className="flex items-center gap-1 text-yellow-500"
                        >
                          <FaBookmark /> Remove from watchlist
                        </button>
                      ) : (
                        <button
                          onClick={() => addWatchlist(movieDetails)}
                          className="flex items-center gap-1 text-gray-400"
                        >
                          <FaRegBookmark /> Add to watchlist
                        </button>
                      )}
                    </div>
                  )}

                  {/* Favorites Button */}
                  {isLoadingFavorites ? (
                    <Spinner type="mini" />
                  ) : (
                    <div className="mt-2 flex justify-center gap-2">
                      {isInFavorites ? (
                        <button
                          onClick={() => removeFavorites(movieDetails.id)}
                          className="flex items-center gap-1 text-red-500"
                        >
                          <FaHeart /> Remove from favorites
                        </button>
                      ) : (
                        <button
                          onClick={() => addFavorites(movieDetails)}
                          className="flex items-center gap-1 text-gray-400"
                        >
                          <FaRegHeart /> Add to favorites
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
