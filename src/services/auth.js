import request from "./index";

export const registerUser = async (userData) =>
  request("/register", "POST", userData);

export const loginUser = async (loginData) =>
  request("/login", "POST", loginData);

export const addToFavorites = async (movieData) =>
  request("/atf", "POST", movieData);

export const removeToFavorites = async (movieData) =>
  request("/rff", "POST", movieData);

export const addToWatchlist = async (movieData) =>
  request("/atwl", "POST", movieData);

export const removeFromWatchlist = async (movieData) =>
  request("/rfwl", "POST", movieData);

export const getFavoritesMovies = async (userData) =>
  request("/gf", "GET", userData);

export const getWatchlistMovies = async (userData) =>
  request("/gwl", "GET", userData);

