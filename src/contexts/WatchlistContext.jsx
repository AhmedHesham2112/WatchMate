import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchMovie } from "../services/apiMovies";
import {
  addToWatchlist as apiAddToWatchlist,
  removeFromWatchlist as apiRemoveFromWatchlist,
  getWatchlistMovies as apiGetWatchlistMovies,
} from "../services/auth";
import { AuthContext } from "./AuthContext";

const WatchlistContext = createContext();

const initialState = {
  watchlist: [],
  isLoading: false,
  error: "",
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
    default:
      throw new Error("Unknown action type");
  }
}

export function WatchlistProvider({ children }) {
  const { authState } = useContext(AuthContext);
  const [{ watchlist, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    async function getWatchlist() {
      dispatch({ type: "loading" });
      try {
        const user_email = localStorage.getItem("userEmail");
        const user_data = { user_email: user_email };
        const ids = await apiGetWatchlistMovies(user_data);
        console.log("Fetched movie IDs:", ids); // Log movie IDs for debugging
        const movies = await Promise.all(ids.map((id) => fetchMovie(id)));
        dispatch({ type: "watchlist/loaded", payload: movies });
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
  }, [authState.isAuthenticated]); // Re-run the effect only when authState changes

  async function addWatchlist(movie) {
    dispatch({ type: "loading" });
    try {
      const user_email = localStorage.getItem("userEmail");
      const movie_data = { movie_id: movie.id, user_email: user_email };
      console.log(movie_data);
      const response = await apiAddToWatchlist(movie_data);
      console.log(response);
      dispatch({ type: "watchlist/add", payload: movie });
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
      const user_email = localStorage.getItem("userEmail");
      const movie_data = { movie_id: id, user_email: user_email };
      console.log(movie_data);
      const response = await apiRemoveFromWatchlist(movie_data);
      console.log(response);
      dispatch({ type: "watchlist/remove", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to remove the movie from watchlist.",
      });
    }
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isLoading,
        error,
        addWatchlist,
        removeWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
