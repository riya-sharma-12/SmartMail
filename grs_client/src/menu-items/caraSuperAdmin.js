// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const caraSuperAdmin = {
    id: 'dashboard',
    title: 'Emails',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: icons.IconDashboard,
            breadcrumbs: true
        },
        // {
        //     id: 'newgrievance',
        //     title: 'Register New Grievance',
        //     type: 'item',
        //     url: '/regnewgrievance',
        //     icon: icons.IconDashboard,
        //     breadcrumbs: true
        // },
        {
            id: 'grievancereports',
            title: 'Email Views',
            type: 'collapse',
            icon: icons.IconDashboard,
            children: [
                {
                    id: 'all-emails',
                    title: 'All Emails',
                    type: 'item',
                    url: '/reports/all-emails',
                    breadcrumbs: false
                },
                {
                    id: 'top-priority-emails',
                    title: 'Top Priority Emails',
                    type: 'item',
                    url: '/reports/top-priority-emails',
                    breadcrumbs: false
                },
                // {
                //     id: 'pushedbackgrievances',
                //     title: 'Pushed-Back Grievances',
                //     type: 'item',
                //     url: '/reports/pushbackedgrievanes',
                //     breadcrumbs: false
                // },
                {
                    id: 'new-emails',
                    title: 'New Emails',
                    type: 'item',
                    url: '/reports/new-emails',
                    breadcrumbs: false
                },
                {
                    id: 'unread-emails',
                    title: 'Unread Emails',
                    type: 'item',
                    url: '/reports/unread-emails',
                    breadcrumbs: false
                },
                {
                    id: 'replied-emails',
                    title: 'Replied Emails',
                    type: 'item',
                    url: '/reports/replied-emails',
                    breadcrumbs: false
                }
            ]
        },
        // {
        //     id: 'newuser',
        //     title: ' User',
        //     type: 'item',
        //     url: '/registernewuser',
        //     icon: icons.IconDashboard,
        //     breadcrumbs: true
        // },
        // {
        //     id: 'usersreports',
        //     title: 'Users Reports',
        //     type: 'collapse',
        //     icon: icons.IconDashboard,
        //     children: [
        //         {
        //             id: 'usersreports',
        //             title: 'All Users',
        //             type: 'item',
        //             url: '/userreports/allusers',
        //             breadcrumbs: false
        //         }
        //     ]
        // },
    ]
};

export default caraSuperAdmin;