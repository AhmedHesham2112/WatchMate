import request from "./index";
import { protectedRequest } from "./index";

export const registerUser = async (userData) =>
  request("/register", "POST", userData);

export const loginUser = async (loginData) =>
  request("/login", "POST", loginData);

export const resendConfirmation = async () =>
  protectedRequest("/resend_confirmation", "POST");

export const addToFavorites = async (movieData) =>
  protectedRequest("/atf", "POST", movieData);

export const removeFromFavorites = async (movieData) =>
  protectedRequest("/rff", "POST", movieData);

export const addToWatchlist = async (movieData) =>
  protectedRequest("/atwl", "POST", movieData);

export const removeFromWatchlist = async (movieData) =>
  protectedRequest("/rfwl", "POST", movieData);

export const getFavoritesMovies = async (userData) =>
  protectedRequest("/gf", "GET", userData);

export const getWatchlistMovies = async (userData) =>
  protectedRequest("/gwl", "GET", userData);
