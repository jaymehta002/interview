import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import Home from "./pages/home/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Launches from "./pages/launches/Launches";
import LaunchDetail from "./pages/launches/LaunchDetail";

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/launches",
        element: (
          <ProtectedRoute>
            <Launches />
          </ProtectedRoute>
        ),
      },
      {
        path: "/launches/:id",
        element: (
          <ProtectedRoute>
            <LaunchDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
