import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "../services/apiMovies";

function usePopularMovies() {
  const {
    isLoading,
    data: popularMovies,
    error,
  } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: fetchPopularMovies,
  });
  return { isLoading, error, popularMovies };
}

export default usePopularMovies;
