// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const caraEmployees = {
    id: 'dashboard',
    title: 'Grievance',
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
            id: '',
            title: 'Email Views',
            type: 'collapse',
            icon: icons.IconDashboard,
            children: [
                {
                    id: 'new-emails',
                    title: 'New Emails',
                    type: 'item',
                    url: '/reports/new-emails',
                    breadcrumbs: false
                },
                {
                  id: 'unresolvedgrievances',
                  title: 'Un-Resolved Grievances',
                  type: 'item',
                  url: '/reports/unresolvedgrievanes',
                  breadcrumbs: false
              },
                {
                    id: 'unread-emails',
                    title: 'Unread Emails',
                    type: 'item',
                    url: '/reports/unread-emails',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default caraEmployees;