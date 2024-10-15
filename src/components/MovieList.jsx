import React, { useRef } from "react";
import MovieCard from "./MovieCard";
import Spinner from "../ui/Spinner";

function MovieList({ categoryFetch, isLoading, similarId }) {
  const listRef = useRef(null);

  return (
    <div className="relative mb-5 w-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          ref={listRef}
          className="flex space-x-5 overflow-x-auto overflow-y-hidden px-10 pb-3 pt-3 scrollbar"
        >
          {(similarId
            ? categoryFetch.results.filter((movie) => similarId !== movie.id)
            : categoryFetch.results
          ).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
