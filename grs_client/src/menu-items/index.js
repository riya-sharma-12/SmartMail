import registerGrievance from './registerGrievance';

// new 
import caraSuperAdmin from './caraSuperAdmin';
import caraAdmin from './caraAdmin';
import caraEmployees from './caraEmployees';
// ==============================|| CARA Admin Level MENU ITEMS ||============================== //



const menuItems = (userAuth) => {
  const Sidebaritems = {
    "0": [registerGrievance],
    "1": [caraSuperAdmin],
    "2": [caraAdmin],
    "3": [caraEmployees],
    "4": [registerGrievance],
  }
  return {
    items: Sidebaritems[`${userAuth}`]
  }
};

export default menuItems;
