import { useState } from "react";
import Search from "../components/Search";
import useSearch from "../hooks/useSearch"; // Import your custom search hook
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function Header() {
  const [query, setQuery] = useState(""); // State to track the search input
  const { movies, isLoading, error } = useSearch(query); // Fetch movies based on search query
  const navigate = useNavigate();

  // This function is triggered when a movie is selected from the dropdown
  const handleMovieSelect = (id) => {
    navigate(`/movie/${id}`);
    setQuery(""); // Clear the search query after selection
  };

  return (
    <header className="mb-3 rounded-lg bg-gradient-to-r from-black via-red-950 to-black py-6 text-center text-white">
      <h2 className="mb-4 text-3xl font-semibold">Looking for something?</h2>
      <div className="relative mx-auto max-w-xl">
        {/* Search Input */}
        <div className="m-2">
          <Search query={query} setQuery={setQuery} />
        </div>

        {/* Search Results Dropdown */}
        {query && (
          <div className="absolute left-0 z-20 mt-2 w-full rounded-lg bg-black shadow-lg">
            {isLoading && <Spinner type="mini" />}
            {error && <p className="p-2 text-red-600">{error}</p>}
            {!isLoading && !error && movies.length === 0 && (
              <p className="p-2 text-white">No results found</p>
            )}
            {!isLoading && !error && movies.length > 0 && (
              <ul className="h-72 overflow-y-auto p-2 scrollbar">
                {movies.map((movie) => (
                  <li
                    key={movie.id}
                    className="flex cursor-pointer items-center p-2 hover:bg-red-900"
                    onClick={() => handleMovieSelect(movie.id)} // Go to movie details
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.Title}
                      className="mr-3 h-16 w-12 rounded"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-white">{movie.title}</span>
                      {movie.release_date && (
                        <span className="text-white">
                          📆 {movie.release_date.slice(0, 4)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
