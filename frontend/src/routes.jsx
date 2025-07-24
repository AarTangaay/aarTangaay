import {
  HomeIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartBarIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications, HealthCentersMap, Recommendation } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Alert from "./pages/dashboard/alert";
import Statistics from "./pages/dashboard/statistics";

// Définissez l'objet icon avant son utilisation
import { isPWA,isMobile } from "@/utils/platform";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,  // Utilisation correcte maintenant
        name: "dashboard",
        path: "/home",
        element: <Home />,
        show: true
      },
      {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "Ressources",
        path: "/ressources",
        element: <HealthCentersMap />,
        show: !isPWA()
      },
      {
        icon: <ExclamationTriangleIcon {...icon} />,
        name: "alerts",
        path: "/alerts",
        element: <Alert />,
        show: true,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
        show: isPWA()
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "statistics",
        path: "/statistics",
        element: <Statistics />,
        show: !isPWA()
      },
      {
        icon: <ReceiptPercentIcon {...icon} />,
        name: "recommandation",
        path: "/recommendation",
        element: <Recommendation />,
        show: true,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
        show: true
      }, 
    ].filter(({ show }) => show !== false), 
  },
  {
    layout: "auth",
    pages: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;