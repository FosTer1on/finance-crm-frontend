import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import PageLoader from "@/components/layout/PageLoader";

import {
  ClearingPage,
  CompaniesPage,
  CompanyPage,
  NotFoundPage,
} from "./LazyPages";

const withSuspense = (element) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<CompaniesPage />),
      },
      {
        path: "companies/:id",
        element: withSuspense(<CompanyPage />),
      },
      {
        path: "clearing",
        element: withSuspense(<ClearingPage />),
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
]);