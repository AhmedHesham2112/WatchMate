import React, { useEffect, useState } from "react";
import usePopularMovies from "../components/usePopularMovies";
import MovieCard from "../components/MovieCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../ui/Spinner";

function PopularMovies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1; // Hook to manage query params
  const { isLoading, error, popularMovies } = usePopularMovies(page); // Pass page to the hook
  const navigate = useNavigate();

  // Get the page from the query parameter or default to 1

  useEffect(() => {
    // When page number in the query params changes, fetch data for the new page
    // This will be handled automatically in your data fetching hook, so no need for manual fetch here
  }, [page]);

  const handleNextPage = () => {
    // Update the URL to reflect the next page
    setSearchParams({ page: page + 1 });
  };

  const handlePrevPage = () => {
    // Update the URL to reflect the previous page (if not on page 1)
    if (page > 1) {
      setSearchParams({ page: page - 1 });
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!popularMovies?.results?.length) return <p>No movies found.</p>;

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Popular Movies</h1>
      <div className="min-h-screen bg-gray-100 p-5">
        {/* Grid layout for displaying movies */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popularMovies?.results?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination controls at the bottom */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`${
              page === 1
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-700"
            } rounded px-4 py-2`}
          >
            Previous Page
          </button>
          <span className="text-lg font-semibold">Page {page}</span>
          <button
            onClick={handleNextPage}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Next Page
          </button>
        </div>
      </div>
    </>
  );
}

export default PopularMovies;
