import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchMovie } from "../services/apiMovies";
import {
  addToFavorites as apiAddToFavorites,
  removeFromFavorites as apiRemoveFromFavorites,
  getFavoritesMovies as apiGetFavoritesMovies,
} from "../services/auth";

const FavoritesContext = createContext();

const initialState = {
  favorites: [],
  isLoading: false,
  error: "",
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
      };
    case "favorites/add":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case "favorites/remove":
      return {
        ...state,
        favorites: state.favorites.filter(
          (favorite) => favorite.id !== action.payload,
        ),
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

export function FavoritesProvider({ children }) {
  const [{ favorites, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    async function getFavorites() {
      dispatch({ type: "loading" });
      try {
        const ids = await apiGetFavoritesMovies(); // Fetch favorite movie IDs
        const movies = await Promise.all(ids.map((id) => fetchMovie(id)));
        dispatch({ type: "favorites/loaded", payload: movies });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Failed to load favorites.",
        });
      }
    }

    getFavorites(); // Fetch favorites when the component mounts
  }, []);

  async function addFavorites(movie) {
    dispatch({ type: "loading" });
    try {
      await apiAddToFavorites({ movieId: movie.id });
      dispatch({ type: "favorites/add", payload: movie });
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
      await apiRemoveFromFavorites({ movieId: id });
      dispatch({ type: "favorites/remove", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Failed to remove the movie from favorites.",
      });
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        error,
        addFavorites,
        removeFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
