import { useQuery } from "@tanstack/react-query";
import { fetchTopRatedMovies } from "../services/apiMovies";

function useTopRatedMovies() {
  const {
    isLoading,
    data: topRatedMovies,
    error,
  } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: fetchTopRatedMovies,
  });
  return { isLoading, error, topRatedMovies };
}

export default useTopRatedMovies;
