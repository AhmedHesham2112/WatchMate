import { useQuery } from "@tanstack/react-query";
import { fetchRecommendations } from "../services/apiMovies";

function useRecommendedMovies(genres, page) {
  const {
    isLoading,
    data: recommendedMovies,
    error,
  } = useQuery({
    queryKey: ["recommendedMovies", genres, page],
    queryFn: () => fetchRecommendations(genres, page),
    keepPreviousData: true,
  });

  return { isLoading, error, recommendedMovies };
}

export default useRecommendedMovies;
