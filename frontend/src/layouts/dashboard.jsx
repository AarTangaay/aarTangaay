// import { Routes, Route } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import { IconButton } from "@material-tailwind/react";
// import {
//   Sidenav,
//   DashboardNavbar,
//   Configurator,
//   Footer,
//   BottomNavbar,
// } from "@/widgets/layout";
// import routes from "@/routes";
// import { isPWA } from "@/routes";
// import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

// export function Dashboard() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavType } = controller;

//   return (
//     <div className="min-h-screen bg-blue-gray-50/50">
//       <Sidenav
//         routes={routes}
//         brandImg={
//           sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
//         }
//       />
//       <div className="p-4 xl:ml-80">
//         <DashboardNavbar />
//         <Configurator />
//         <IconButton
//           size="lg"
//           color="white"
//           className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
//           ripple={false}
//           onClick={() => setOpenConfigurator(dispatch, true)}
//         >
//           <Cog6ToothIcon className="h-5 w-5" />
//         </IconButton>
//         <Routes>
//           {routes.map(
//             ({ layout, pages }) =>
//               layout === "dashboard" &&
//               pages.map(({ path, element }) => (
//                 <Route exact path={path} element={element} />
//               ))
//           )}
//         </Routes>
//         <div className="text-blue-gray-600">
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }

// Dashboard.displayName = "/src/layout/dashboard.jsx";

// export default Dashboard;

import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
  BottomNavbar,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { isPWA ,isMobile} from "@/utils/platform"; // Modifiez cette ligne

// Simulez le contexte d'authentification (à remplacer par votre vraie implémentation)
const useAuth = () => {
  return {
    user: {
      role: isPWA() || isMobile() ? 'client' : 'admin' // Auto-détection du rôle
    }
  };
};

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { user } = useAuth();

  // Filtrez les routes selon la plateforme
  const filteredRoutes = routes.map(routeGroup => {
    if (routeGroup.layout === "dashboard") {
      return {
        ...routeGroup,
        pages: routeGroup.pages.filter(page => page.show !== false)
      };
    }
    return routeGroup;
  });

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* Afficher la Sidebar seulement sur web */}
      {(!isPWA() && !isMobile()) && (
        <Sidenav
          routes={filteredRoutes}
          brandImg={
            sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          }
        />
      )}

      <div className={`p-4 ${(!isPWA() && !isMobile()) ? 'xl:ml-80' : ''}`}>
        <DashboardNavbar />
        <Configurator />
        
        {/* Bouton de configuration seulement pour les admins sur web */}
        {(user?.role === 'admin' && !isPWA() && !isMobile()) && (
          <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </IconButton>
        )}

        <Routes>
          {filteredRoutes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} key={path} />
              ))
          )}
        </Routes>

        {(!isPWA() && !isMobile()) && (
          <div className="text-blue-gray-600">
            <Footer />
          </div>
        )}
      </div>

      {(isPWA() || isMobile()) && <BottomNavbar />}
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
