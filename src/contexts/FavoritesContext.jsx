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
        const user_email = localStorage.getItem("userEmail");
        const user_data = { user_email: user_email };
        const ids = await apiGetFavoritesMovies(user_data); // Check if this request returns correct data
        console.log("Fetched movie IDs:", ids); // Add logging for debugging

        const movies = await Promise.all(ids.map((id) => fetchMovie(id)));
        dispatch({ type: "favorites/loaded", payload: movies });
      } catch (error) {
        console.error("Error fetching favorites:", error);
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
      const user_email = localStorage.getItem("userEmail");
      const movie_data = { movie_id: movie.id, user_email: user_email };
      console.log(movie_data);
      const response = await apiAddToFavorites(movie_data);
      console.log(response);
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
      const user_email = localStorage.getItem("userEmail");
      const movie_data = { movie_id: id, user_email: user_email };
      console.log(movie_data);
      const response = await apiRemoveFromFavorites(movie_data);
      console.log(response);
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
