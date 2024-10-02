import request from "./index";

export const registerUser = async (userData) =>
  request("/register", "POST", userData);

export const loginUser = async (loginData) =>
  request("/login", "POST", loginData);
