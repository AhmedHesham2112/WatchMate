import { useQuery } from "@tanstack/react-query";
import { fetchMovie } from "../services/apiMovies"; // Adjust the path as necessary

function useMovieDetails(movieId) {
  const {
    data: movieDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovie(movieId),
  });

  return { movieDetails, isLoading, error };
}

export default useMovieDetails;
