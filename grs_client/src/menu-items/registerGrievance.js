// assets
import { IconRegistered } from '@tabler/icons';

// constant
const icons = { IconRegistered };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const registerGrievance = {
    id: 'dashboard',
    title: 'Grievance',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Register Grievance',
            type: 'item',
            url: '/authUser/registerGrievance',
            icon: icons.IconRegistered,
            breadcrumbs: false
        }
    ]
};

export default registerGrievance;
