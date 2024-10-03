import { useQuery } from "@tanstack/react-query";
import { fetchTopRatedMovies } from "../services/apiMovies";

function useTopRatedMovies(page) {
  const {
    isLoading,
    data: topRatedMovies,
    error,
  } = useQuery({
    queryKey: ["topRatedMovies", page], // Add page to the queryKey array
    queryFn: () => fetchTopRatedMovies(page), // Pass page to the fetch function
    keepPreviousData: true, // This option keeps the previous page's data until the new data is fetched
  });

  return { isLoading, error, topRatedMovies };
}

export default useTopRatedMovies;
