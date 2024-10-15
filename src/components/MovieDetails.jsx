import React, { useContext, useEffect, useState } from "react";
import useMovieDetails from "./useMovieDetails";
import { useParams } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useWatchlist } from "../contexts/WatchlistContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { AuthContext } from "../contexts/AuthContext";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import MovieList from "./MovieList";
import useRecommendedMovies from "./useRecommendedMovies";
import { fetchProviders } from "../services/apiMovies";

function MovieDetails() {
  const { authState } = useContext(AuthContext);
  const { id } = useParams();
  const { movieDetails, isLoading, error } = useMovieDetails(id);
  const {
    addWatchlist,
    removeWatchlist,
    watchlist,
    isLoading: isLoadingWatchlist,
    isUserVerified,
  } = useWatchlist();
  const {
    addFavorites,
    removeFavorites,
    favorites,
    isLoading: isLoadingFavorites,
  } = useFavorites();

  const genres = movieDetails
    ? movieDetails.genres.map((genre) => genre.id).join("%2C")
    : "";
  const { isLoading: isLoadingRecommended, recommendedMovies } =
    useRecommendedMovies(genres);

  const [watchProvider, setWatchProvider] = useState("");
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  useEffect(() => {
    async function getProviders() {
      try {
        setIsProviderLoading(true);
        if (movieDetails && movieDetails.id) {
          const res = await fetchProviders(movieDetails.id);
          const provider =
            res.results.US?.buy?.[0] ||
            res.results.US?.flatrate?.[0] ||
            res.results.US?.rent?.[0];
          if (provider) setWatchProvider(provider);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProviderLoading(false);
      }
    }
    getProviders();
  }, [movieDetails]);

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
        {watchProvider !== "" ? (
          <div className="">
            {isProviderLoading && <Spinner />}
            <span className="text-lg font-semibold">Watch Provider: </span>
            <img
              src={`https://media.themoviedb.org/t/p/original${watchProvider.logo_path}`}
              className="m-2 inline-block h-8 w-8"
            />
            <span> {watchProvider.provider_name} </span>
          </div>
        ) : (
          ""
        )}

        {authState.isAuthenticated && isUserVerified && (
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
      {/* Similar section */}
      <div className="mb-4 w-full px-4">
        <p className="mt-4 text-xl font-semibold">Similar Movies</p>
        <MovieList
          categoryFetch={recommendedMovies}
          isLoading={isLoadingRecommended}
          key="recommendedMovies"
          similarId={movieDetails.id}
        />
      </div>
    </div>
  );
}

export default MovieDetails;
