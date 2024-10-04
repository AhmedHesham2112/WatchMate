import React, { useEffect, useState } from "react";
import useTopRatedMovies from "../components/useTopRatedMovies";
import MovieCard from "../components/MovieCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

function TopRatedMovies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1; // Hook to manage query params
  const { isLoading, error, topRatedMovies } = useTopRatedMovies(page); // Pass page to the hook
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
  if (!topRatedMovies?.results?.length) return <p>No movies found.</p>;

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Top Rated Movies</h1>
      <div className="min-h-screen p-5">
        {/* Grid layout for displaying movies */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRatedMovies?.results?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination controls at the bottom */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            type={`${page === 1 ? "disabled" : "primary"}`}
          >
            Previous Page
          </Button>
          <span className="text-lg font-semibold">Page {page}</span>
          <Button onClick={handleNextPage} type="primary">
            Next Page
          </Button>
        </div>
      </div>
    </>
  );
}

export default TopRatedMovies;
