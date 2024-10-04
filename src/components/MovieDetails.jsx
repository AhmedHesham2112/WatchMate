import React from "react";
import useMovieDetails from "./useMovieDetails";
import { useParams } from "react-router-dom";
import Spinner from "../ui/Spinner";

function MovieDetails() {
  const { id } = useParams(); // Get the movie ID from the URL
  const { movieDetails, isLoading, error } = useMovieDetails(id);

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
