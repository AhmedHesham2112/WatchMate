import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchMovie } from "../services/apiMovies";
import {
  addToFavorites as apiAddToFavorites,
  removeFromFavorites as apiRemoveFromFavorites,
  getFavoritesMovies as apiGetFavoritesMovies,
  resendConfirmation as apiResendConfirmation,
} from "../services/auth";
import { AuthContext } from "./AuthContext";

const FavoritesContext = createContext();

const initialState = {
  favorites: [],
  isLoading: false,
  error: "",
  isUserVerified: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "favorites/loaded":
      return {
        ...state,
        isLoading: false,
        favorites: action.payload,
        isUserVerified: true,
        error: "",
      };
    case "favorites/add":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        isLoading: false,
        error: "",
      };
    case "favorites/remove":
      return {
        ...state,
        favorites: state.favorites.filter(
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
          "User is not verified. Please verify your email to access favorites.",
      };
    default:
      throw new Error("Unknown action type");
  }
}

export function FavoritesProvider({ children }) {
  const { authState } = useContext(AuthContext);
  const [{ favorites, isLoading, error, isUserVerified }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    async function getFavorites() {
      dispatch({ type: "loading" });
      try {
        const ids = await apiGetFavoritesMovies();
        if (ids.message === "User not verified") {
          dispatch({ type: "user/not-verified" });
        } else {
          const movies = await Promise.all(
            ids.result.map((id) => fetchMovie(id)),
          );
          dispatch({ type: "favorites/loaded", payload: movies });
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        dispatch({
          type: "rejected",
          payload: "Failed to load favorites.",
        });
      }
    }

    if (authState.isAuthenticated) {
      getFavorites();
    }
  }, [authState.isAuthenticated]);

  async function addFavorites(movie) {
    dispatch({ type: "loading" });
    try {
      const movie_data = { movie_id: movie.id };

      const response = await apiAddToFavorites(movie_data);
      if (response.message === "User not verified") {
        dispatch({ type: "user/not-verified" });
      } else {
        dispatch({ type: "favorites/add", payload: movie });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to add the movie to favorites.",
      });
    }
  }

  async function removeFavorites(id) {
    dispatch({ type: "loading" });
    try {
      const movie_data = { movie_id: id };

      const response = await apiRemoveFromFavorites(movie_data);
      if (response.message === "User not verified") {
        dispatch({ type: "user/not-verified" });
      } else {
        dispatch({ type: "favorites/remove", payload: id });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to remove the movie from favorites.",
      });
    }
  }

  async function resendConfirmationEmail() {
    dispatch({ type: "loading" });
    try {
      const response = await apiResendConfirmation();
      if (response.success) {
        alert("Confirmation email has been resent. Please check your inbox.");
      } else {
        dispatch({
          type: "rejected",
          payload: "Failed to resend confirmation email.",
        });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to resend confirmation email.",
      });
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        error,
        isUserVerified,
        addFavorites,
        removeFavorites,
        resendConfirmationEmail,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
