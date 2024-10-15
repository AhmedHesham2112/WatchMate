import { useEffect, useRef, useState } from "react";
import { getRecommendations as getRecommendationsGenres } from "../services/auth";
import { fetchRecommendations } from "../services/apiMovies";
import MovieList from "./MovieList";
import Spinner from "../ui/Spinner";
import MovieCard from "./MovieCard";
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
          console.log(genres);
          if (genres) {
            const recommendations = await fetchRecommendations(genres);
            setRecommendedMovies(recommendations);
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
      <p className="m-4 text-xl font-semibold">Recommendations</p>

      {recommendaitonsMovies.length !== 0 ? (
        <MovieList
          categoryFetch={recommendaitonsMovies}
          isLoading={isLoading}
          key="recommendaitonsMovies"
        />
      ) : (
        <p>Please add movies to your favorites</p>
      )}
    </>
  );
}

export default RecommendedList;
