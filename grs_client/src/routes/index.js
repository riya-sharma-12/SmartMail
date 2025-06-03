import { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import defaultRoutes from './defaultRoutes';


//new
import caraUserRoutes from './caraUsers';
import caraEmployeesRoutes from './caraEmployees';
import caraAdminRoutes from './caraAdmin';
import caraSuperAdminRoutes from './caraSuperAdmin';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const [userAuth, setUserAuth] = useState('0');

  useEffect(() => {
    try {
      const storedUserAuth = 1
      localStorage.setItem('userAuth', '1');

      setUserAuth(storedUserAuth || '0');
    } catch (err) {
      console.error('Error fetching userAuth from local storage', err);
    }
  }, [userAuth]); // Empty dependency array means this effect will run once on mount

  const routesObject = {
    "0": [defaultRoutes],
    "1": [caraUserRoutes, caraEmployeesRoutes, caraAdminRoutes, caraSuperAdminRoutes],
    "2": [caraUserRoutes, caraEmployeesRoutes, caraAdminRoutes],
    "3": [caraUserRoutes, caraEmployeesRoutes],
    "4": [caraUserRoutes],
  };

  // In ThemeRoutes component
  return useRoutes([...(routesObject[userAuth] || [])]);
}
