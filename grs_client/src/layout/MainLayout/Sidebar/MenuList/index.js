// material-ui
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';


// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const [userAuth, setUserAuth] = useState('0');

  useEffect(() => {
    try {
      if (localStorage.getItem("userAuth")) {
        const userAuth = localStorage.getItem("userAuth");
        setUserAuth(userAuth);
      }
    } catch (err) {
      //console.log("err", err)
    }
  }, [])

  const navItems = menuItem(userAuth).items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
