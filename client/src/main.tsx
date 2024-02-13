import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from "./pages";
import Profile from "./pages/blog";
import Login from "./pages/auth/login";
import SingUp from "./pages/auth/sing-up";
import ResetPassword from "./pages/auth/reset-password";
import AccountVerification from "./pages/auth/account-verification";
import ForgatPassword from "./pages/auth/forgat-password";
import Layout from './root';

const router = createBrowserRouter([
  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/blog/:blogName",
        element: <Profile />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/sing-up",
        element: <SingUp />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/auth/account-verification",
        element: <AccountVerification />,
      },
      {
        path: "/auth/forgat-password",
        element: <ForgatPassword />,
      }
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
