import { useEffect, useRef, useState } from "react";
import {
  getRecommendations as getRecommendationsGenres,
  getFavoritesMovies,
} from "../services/auth";
import { fetchRecommendations } from "../services/apiMovies";
import MovieList from "./MovieList";
import Spinner from "../ui/Spinner";
import { useFavorites } from "../contexts/FavoritesContext";

function RecommendedList() {
  const { favorites } = useFavorites();
  const [recommendaitonsMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      async function RecommendedGenres() {
        try {
          setIsLoading(true);
          const res = await getRecommendationsGenres();
          const genres = res.result.join("%2C");
          if (genres) {
            let movies = [];
            let pageToFetch = 1;
            let fetchedMovies = [];
            const filteredFavMovies = favorites?.map((movie) => movie.id);

            while (movies.length < 20) {
              // Fetch the recommendations for the current page
              const recommendations = await fetchRecommendations(
                genres,
                pageToFetch,
              );

              // Filter out movies that are in the user's favorites
              fetchedMovies = recommendations.results.filter(
                (movie) => !filteredFavMovies.includes(movie.id),
              );

              // Add the filtered movies to the list
              movies = [...movies, ...fetchedMovies];

              // If fewer than 20 movies are available after filtering, fetch the next page
              if (movies.length < 20) {
                pageToFetch += 1; // Increment page number to fetch the next page
              } else {
                // Break the loop once we have 20 or more movies
                break;
              }
            }

            // Ensure only 20 movies are stored, even if more were fetched
            let finalMovies = movies.slice(0, 20);

            // Shuffle the final movies list
            // finalMovies = finalMovies.sort(() => Math.random() - 0.5);

            // Set the recommended movies with the final filtered movies
            setRecommendedMovies({ results: finalMovies });
          }
        } catch (err) {
          console.error(err);
        }
      }
      RecommendedGenres();
    } finally {
      setIsLoading(false);
    }
  }, [favorites]);

  if (isLoading) return <Spinner />;

  return (
    <>
      {recommendaitonsMovies.length !== 0 ? (
        <>
          <p className="m-4 text-xl font-semibold">Recommendations</p>
          <MovieList
            categoryFetch={recommendaitonsMovies}
            isLoading={isLoading}
            key="recommendaitonsMovies"
          />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default RecommendedList;
