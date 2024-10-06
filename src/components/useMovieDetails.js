import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "../services/apiMovies"; // Adjust the path as necessary

function useMovieDetails(movieId, imdb) {
  const {
    data: movieDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovie(movieId, imdb),
  });

  return { movieDetails, isLoading, error };
}

export default useMovieDetails;
