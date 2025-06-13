// src/routes/ThemeRoutes.js
import { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import defaultRoutes from './defaultRoutes';
import caraAdminRoutes from './caraAdmin';

export default function ThemeRoutes() {
  const [userAuth, setUserAuth] = useState('0');

useEffect(() => {
  const stored = localStorage.getItem('userAuth') || '0';
  setUserAuth(stored);
}, []);

  const routes = userAuth === '1' ? [caraAdminRoutes] : [defaultRoutes];
  
  return useRoutes(routes);
}
