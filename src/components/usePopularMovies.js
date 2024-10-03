import { useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "../services/apiMovies";

function usePopularMovies(page) {
  const {
    isLoading,
    data: popularMovies,
    error,
  } = useQuery({
    queryKey: ["popularMovies", page],
    queryFn: () => fetchPopularMovies(page),
    keepPreviousData: true,
  });
  return { isLoading, error, popularMovies };
}

export default usePopularMovies;
