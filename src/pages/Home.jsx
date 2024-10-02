import React from "react";
import MovieList from "../components/MovieList";
import usePopularMovies from "../components/usePopularMovies";
import useTopRatedMovies from "../components/useTopRatedMovies";

function Home() {
  const { isLoading: isLoadingPopular, popularMovies } = usePopularMovies();
  const { isLoading: isLoadingTopRated, topRatedMovies } = useTopRatedMovies();

  return (
    <div className="w-full px-4">
      <h1 className="m-4 text-xl font-semibold">Popular Movies</h1>
      <MovieList
        categoryFetch={popularMovies}
        isLoading={isLoadingPopular}
        key="popularMovies"
      />
      <h1 className="m-4 text-xl font-semibold">Top Rated Movies</h1>
      <MovieList
        categoryFetch={topRatedMovies}
        isLoading={isLoadingTopRated}
        key="topRatedMovies"
      />
    </div>
  );
}

export default Home;
