import { HomeIcon, BellIcon, UserCircleIcon, ReceiptPercentIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

export function BottomNavbar() {
  const location = useLocation();
  
  // Définition des items de navigation
  const navItems = [
    {
      icon: <HomeIcon className="w-6 h-6" />,
      label: "Accueil",
      path: "/dashboard/home"
    },
    {
      icon: <BellIcon className="w-6 h-6" />,
      label: "Alertes",
      path: "/dashboard/alerts"
    },
    {
      icon:<ReceiptPercentIcon className="w-6 h-6" />,
      label: "Recommandations",
      path: "/dashboard/recommandation"
    },
    {
      icon: <UserCircleIcon className="w-6 h-6" />,
      label: "Profil",
      path: "/dashboard/profile"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-[1000]">
      <div className="flex justify-around items-center p-2 ">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center p-2 rounded-lg transition-all duration-300
              ${location.pathname === item.path 
                ? "text-indigo-600 bg-indigo-50" 
                : "text-gray-600 hover:text-indigo-500 hover:bg-indigo-50/50"}
            `}
          >
            <div className="relative">
              {item.icon}
              {item.path === "/dashboard/alerts" && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}