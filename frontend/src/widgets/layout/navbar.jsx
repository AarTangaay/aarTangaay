import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { isMobile, isPWA } from "@/utils/platform";

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Détection de la plateforme
    setIsMobileDevice(isMobile() || isPWA());
    
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
      setIsMobileDevice(isMobile() || isPWA());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon, showOnMobile = true }) => (
        (isMobileDevice ? showOnMobile : true) && (
          <Typography
            key={name}
            as="li"
            variant="small"
            color="blue-gray"
            className="capitalize"
          >
            <Link 
              to={path} 
              className="flex items-center gap-1 p-1 font-normal hover:text-indigo-500 transition-colors"
              onClick={() => isMobileDevice && setOpenNav(false)}
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </Link>
          </Typography>
        )
      ))}
    </ul>
  );

  return (
    <MTNavbar className="p-3 sticky top-0 z-[1000]">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/" className="flex items-center">
          <Typography
            variant="h6"
            className="mr-4 cursor-pointer font-bold"
          >
            {brandName}
          </Typography>
        </Link>
        
        {/* Version desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="hidden lg:block">{navList}</div>
          {action && React.cloneElement(action, {
            className: "hidden lg:inline-block",
          })}
        </div>

        {/* Bouton menu burger pour mobile */}
        {(isMobileDevice || window.innerWidth < 960) && (
          <IconButton
            variant="text"
            size="sm"
            color="gray"
            className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon strokeWidth={2} className="h-6 w-6" />
            ) : (
              <Bars3Icon strokeWidth={2} className="h-6 w-6" />
            )}
          </IconButton>
        )}
      </div>

      {/* Menu déroulant mobile */}
      <Collapse open={openNav} className="overflow-hidden">
        <div className="container mx-auto bg-white rounded-lg shadow-lg mt-2 p-4">
          {navList}
          {action && React.cloneElement(action, {
            className: "w-full block lg:hidden mt-4",
          })}
        </div>
      </Collapse>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "AarTangaay",
  action: null,
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    showOnMobile: PropTypes.bool,
  })).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;