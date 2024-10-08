import { useState, useEffect } from "react";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTMzOWYyMjU2MDlmOGZiYjI4YWQ3YzZlYjBmMTczYSIsIm5iZiI6MTcyNzgwNzE2OC43NTgxMjcsInN1YiI6IjY2ZjMwODE3YTk3ODgwMTQ4ZjNiOWI2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9cnPkFkVJkVcbK0fQBfh3eMYQNV9NB_4kmrJWQG5tm8",
  },
};

export default function useSearch(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSearch() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}`,
          { ...options, signal: controller.signal },
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();

        if (data.results.length === 0) throw new Error("Movie not found");

        setMovies(data.results);
        setError("");
      } catch (err) {
        console.error(err.message);
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 2) {
      setMovies([]);
      setError("");
      return;
    }

    fetchSearch();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
