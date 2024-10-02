import React, { useRef } from "react";
import MovieCard from "./MovieCard";
import Spinner from "../ui/Spinner";

function MovieList({ categoryFetch, isLoading }) {
  const listRef = useRef(null);

  return (
    <div className="relative mb-5 w-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          ref={listRef}
          className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 flex space-x-5 overflow-x-auto px-10"
        >
          {categoryFetch.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
