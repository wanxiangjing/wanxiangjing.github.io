
import { createHashRouter } from "react-router";
// 增加懒加载
import { lazy } from "react";

const Layout = lazy(() => import('@/Layout'));
const MainTourGuide = lazy(() => import('@/pages/MainTourGuide'));
const PermissionPage = lazy(() => import('@/pages/PermissionPage'));
const Room = lazy(() => import('@/pages/Room'));
const Preload = lazy(() => import('@/pages/Preload'));
const Login = lazy(() => import('@/pages/Login'));


const router = createHashRouter([
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