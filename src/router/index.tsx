import { createHashRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouterLoading from "@/components/Loading/RouterLoading"; // 你的 Loading 组件

const Layout = lazy(() => import("@/Layout"));
const MainTourGuide = lazy(() => import("@/pages/MainTourGuide"));
const PermissionPage = lazy(() => import("@/pages/PermissionPage"));
const Room = lazy(() => import("@/pages/Room"));
const Preload = lazy(() => import("@/pages/Preload"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));
const Map = lazy(() => import("@/pages/Map"))

const RouterSuspense = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      {children}
    </Suspense>
  )
}

const router = createHashRouter([
  {
    path: "/",
    element: (
      <RouterSuspense>
        <Layout />
      </RouterSuspense>
    ),
    children: [
      {
        index: true,
        element: (
          <RouterSuspense>
            <MainTourGuide />
          </RouterSuspense>
        ),
      },
      {
        path: "/permission",
        element: (
          <RouterSuspense>
            <PermissionPage />
          </RouterSuspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <RouterSuspense>
            <Profile />
          </RouterSuspense>
        ),
      },

    ],
  },
  {
    path: "/room",
    element: (
      <RouterSuspense>
        <Room />
      </RouterSuspense>
    ),
  },
  {
    path: "/preload",
    element: (
      <RouterSuspense>
        <Preload />
      </RouterSuspense>
    ),
  },
  
  {
    path: "/map",
    element: (
      <RouterSuspense>
        <Map />
      </RouterSuspense>
    ),
  },
  {
    path: "/login",
    element: (
      <RouterSuspense>
        <Login />
      </RouterSuspense>
    ),
  },
], {
  basename: "/",
});

export default router;