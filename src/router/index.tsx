import Layout from "@/Layout";
import Login from "@/pages/Login";
import MainTourGuide from "@/pages/MainTourGuide";
import Preload from "@/pages/Preload";
import Room from "@/pages/Room";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/preload",
    element: <Preload />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainTourGuide />,
      },
      {
        path: '/room',
        element: <Room />,
      }
    ]
  },

], {
  basename: "/",
});

export default router;