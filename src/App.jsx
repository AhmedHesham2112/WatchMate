import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import Login from "./pages/Login";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import Register from "./pages/Register";
import { RegisterProvider } from "./contexts/RegisterContext";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/login",
        element: (
          <AuthProvider>
            <Login />
          </AuthProvider>
        ),
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
          <AuthProvider>
            <Watchlist />
          </AuthProvider>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <RouterProvider router={router} />
      </WatchlistProvider>
    </QueryClientProvider>
  );
}

export default App;
