// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const userMenuItems = {
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
        {
            id: 'emailviews',
            title: 'Email Views',
            type: 'collapse',
            icon: icons.IconDashboard,
            children: [
                {
                    id: 'all-emails',
                    title: 'All Emails',
                    type: 'item',
                    url: '/all-emails',
                    breadcrumbs: false
                },
                {
                    id: 'top-priority-emails',
                    title: 'Top Priority Emails',
                    type: 'item',
                    url: '/top-priority-emails',
                    breadcrumbs: false
                },
                {
                    id: 'new-emails',
                    title: 'New Emails',
                    type: 'item',
                    url: '/new-emails',
                    breadcrumbs: false
                },
                {
                    id: 'replied-emails',
                    title: 'AI Replied Emails',
                    type: 'item',
                    url: '/replied-emails',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default userMenuItems;
