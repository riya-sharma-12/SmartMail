// Removed unused imports
import userMenuItems from './menuItems';  // You can rename this file later if needed

// ==============================|| Sidebar MENU ITEMS ||============================== //

const menuItems = () => {
  return {
    items: [userMenuItems]  // Only one role, so directly return
  };
};

export default menuItems;
