import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications,HealthCentersMap } from "@/pages/dashboard";
import {SignIn , SignUp} from "@/pages/auth";
import Alert from "./pages/dashboard/alert";

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
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Ressources ",
        path: "/ressources",
        element: <HealthCentersMap />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <ExclamationTriangleIcon {...icon} />,
        name: "alerts",
        path: "/alerts",
        element: <Alert />,
      },
      
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Se Connecter",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
