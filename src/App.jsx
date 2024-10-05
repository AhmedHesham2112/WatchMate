import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import Login from "./pages/Login";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./helper/PrivateRoute";
import { RegisterProvider } from "./contexts/RegisterContext";
import TopRatedMovies from "./pages/TopRatedMovies";
import PopularMovies from "./pages/PopularMovies";
import MovieDetails from "./components/MovieDetails";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/topratedmovies", element: <TopRatedMovies /> },
      { path: "/popularmovies", element: <PopularMovies /> },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "/register",
        element: (
          <RegisterProvider>
            <Register />
          </RegisterProvider>
        ),
      },
      {
        path: "/watchlist",
        element: (
          <PrivateRoute>
            <Watchlist />
          </PrivateRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <RouterProvider router={router} />
          </WatchlistProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
