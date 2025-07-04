import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications,HealthCentersMap } from "@/pages/dashboard";
import {SignIn , SignUp} from "@/pages/auth";
import Alert from "./pages/dashboard/alert";
import Statistics from "./pages/dashboard/statistics";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "Ressources ",
        path: "/ressources",
        element: <HealthCentersMap />,
      },
      {
        icon: <ExclamationTriangleIcon {...icon} />,
        name: "alerts",
        path: "/alerts",
        element: <Alert />,
      },
      {
        // icon: <BellIcon {...icon} />,
        // name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "statistics",
        path: "/statistics",
        element: <Statistics />,
      },
            {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      }, 
    ],
  },
  {
    // title: "auth pages",
    layout: "auth",
    pages: [
      {
        // icon: <UserIcon {...icon} />,
        // name: "Se Connecter",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        // icon: <ServerStackIcon {...icon} />,
        // name: "",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
