// src/routes/ThemeRoutes.js
import { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import defaultRoutes from './defaultRoutes';
import menuItemRoutes from './menuItems';

export default function ThemeRoutes() {
  const [userAuth, setUserAuth] = useState('0');

useEffect(() => {
  const stored = localStorage.getItem('userAuth') || '0';
  setUserAuth(stored);
}, []);

  const routes = userAuth === '1' ? [menuItemRoutes] : [defaultRoutes];
  
  return useRoutes(routes);
}
