import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchMovie } from "../services/apiMovies";
import {
  addToWatchlist as apiAddToWatchlist,
  removeFromWatchlist as apiRemoveFromWatchlist,
  getWatchlistMovies as apiGetWatchlistMovies,
  resendConfirmation as apiResendConfirmation,
} from "../services/auth";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

const WatchlistContext = createContext();

const initialState = {
  watchlist: [],
  isLoading: false,
  error: "",
  isUserVerified: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "watchlist/loaded":
      return {
        ...state,
        isLoading: false,
        watchlist: action.payload,
        isUserVerified: true,
        error: "",
      };
    case "watchlist/add":
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
        isLoading: false,
        error: "",
      };
    case "watchlist/remove":
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (favorite) => favorite.id !== action.payload,
        ),
        isLoading: false,
        error: "",
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "user/not-verified":
      return {
        ...state,
        isLoading: false,
        isUserVerified: false,
        error:
          "User is not verified. Please verify your email to access watchlist.",
      };
    default:
      throw new Error("Unknown action type");
  }
}

export function WatchlistProvider({ children }) {
  const { authState } = useContext(AuthContext);
  const [{ watchlist, isLoading, error, isUserVerified }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    async function getWatchlist() {
      dispatch({ type: "loading" });
      try {
        const ids = await apiGetWatchlistMovies();
        if (ids.message === "User not verified") {
          dispatch({ type: "user/not-verified" });
        } else {
          const movies = await Promise.all(
            ids.result.map((id) => fetchMovie(id)),
          );
          dispatch({ type: "watchlist/loaded", payload: movies });
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        dispatch({
          type: "rejected",
          payload: "Failed to load watchlist.",
        });
      }
    }

    if (authState.isAuthenticated) {
      getWatchlist();
    }
  }, [authState.isAuthenticated]);

  async function addWatchlist(movie) {
    dispatch({ type: "loading" });
    try {
      const movie_data = { movie_id: movie.id };

      const response = await apiAddToWatchlist(movie_data);
      if (response.message === "User not verified") {
        dispatch({ type: "user/not-verified" });
      } else {
        dispatch({ type: "watchlist/add", payload: movie });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to add the movie to watchlist.",
      });
    }
  }

  async function removeWatchlist(id) {
    dispatch({ type: "loading" });
    try {
      const movie_data = { movie_id: id };

      const response = await apiRemoveFromWatchlist(movie_data);
      if (response.message === "User not verified") {
        dispatch({ type: "user/not-verified" });
      } else {
        dispatch({ type: "watchlist/remove", payload: id });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to remove the movie from watchlist.",
      });
    }
  }

  async function resendConfirmationEmail() {
    dispatch({ type: "loading" });
    try {
      const response = await apiResendConfirmation();
      if (response.message === "Confirmation email resent.") {
        toast.success(
          "Confirmation email has been resent. Please check your inbox.",
          {
            position: "top-center",
            className: "custom-toast",
          },
        );
      } else {
        dispatch({
          type: "rejected",
          payload: "Failed to resend confirmation email.",
        });
        toast.error("Failed to resend confirmation email.", {
          position: "top-center",
          className: "custom-toast",
        });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to resend confirmation email.",
      });
      toast.error("An error occurred while resending confirmation email.", {
        position: "top-center",
        className: "custom-toast",
      });
    }
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isLoading,
        error,
        isUserVerified,
        addWatchlist,
        removeWatchlist,
        resendConfirmationEmail,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
