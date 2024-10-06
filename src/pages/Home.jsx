import React from "react";
import MovieList from "../components/MovieList";
import usePopularMovies from "../components/usePopularMovies";
import useTopRatedMovies from "../components/useTopRatedMovies";
import { Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";

function Home() {
  const { isLoading: isLoadingPopular, popularMovies } = usePopularMovies();
  const { isLoading: isLoadingTopRated, topRatedMovies } = useTopRatedMovies();

  return (
    <div className="w-full px-4">
      <Header />
      <Link className="m-4 text-xl font-semibold" to="/popularmovies">
        Popular Movies
      </Link>
      <MovieList
        categoryFetch={popularMovies}
        isLoading={isLoadingPopular}
        key="popularMovies"
      />
      <Link className="m-4 text-xl font-semibold" to="/topratedmovies">
        Top Rated Movies
      </Link>
      <MovieList
        categoryFetch={topRatedMovies}
        isLoading={isLoadingTopRated}
        key="topRatedMovies"
      />
    </div>
  );
}

export default Home;
