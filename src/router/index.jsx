import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CompaniesPage from "../pages/CompaniesPage";
import CompanyPage from "../pages/CompanyPage";
import NotFoundPage from "../pages/NotFoundPage";
import ClearingPage from "../pages/ClearingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CompaniesPage />,
      },
      {
        path: "companies/:id",
        element: <CompanyPage />,
      },
      {
        path: "clearing",
        element: <ClearingPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);