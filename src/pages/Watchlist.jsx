import React from "react";
import { useWatchlist } from "../contexts/WatchlistContext";
import MovieCard from "../components/MovieCard";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Watchlist = () => {
  const {
    watchlist,
    isLoading,
    error,
    isUserVerified,
    resendConfirmationEmail,
  } = useWatchlist();

  if (!isUserVerified) {
    return (
      <div className="m-10 flex h-[100vh] flex-col items-center justify-center gap-5">
        <p>Please verify your email to access your watchlist.</p>
        <Button type="primary" onClick={resendConfirmationEmail}>
          Resend Verification To Your Email
        </Button>
        <ToastContainer />
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <>
        <h1 className="m-4 text-xl font-semibold">Watchlist Movies</h1>
        <div className="min-h-screen p-5">
          <p>Add movies to your watchlist</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="m-4 text-xl font-semibold">Watchlist Movies</h1>
      <div className="min-h-screen p-5">
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p>Add movies to your Watchlist</p>
        )}
      </div>
    </>
  );
};

export default Watchlist;
