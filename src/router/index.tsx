import Layout from "@/Layout";
import Login from "@/pages/Login";
import MainTourGuide from "@/pages/MainTourGuide";
import Preload from "@/pages/Preload";
import PermissionPage from "@/pages/PermissionPage";
import Room from "@/pages/Room";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainTourGuide />,
      },
      {
        path: '/permission',
        element: <PermissionPage />,
      },
    ]
  },
  {
    path: '/room',
    element: <Room />,
  },
  {
    path: "/preload",
    element: <Preload />,
  },
  {
    path: "/login",
    element: <Login />,
  },

], {
  basename: "/",
});

export default router;