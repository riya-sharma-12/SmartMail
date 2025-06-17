import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Login = Loadable(lazy(() => import('views/pages/authentication/login')));
const AllEmails = Loadable(lazy(() => import('views/emailViews/grievancesReports/allEmails')));
const TopPriorityMails = Loadable(lazy(() => import('views/emailViews/grievancesReports/topPriorityMails')));
const RepliedEmailsView = Loadable(lazy(() => import('views/emailViews/grievancesReports/repliedEmailView')));
const NewEmailsView = Loadable(lazy(() => import('views/emailViews/grievancesReports/newEmailsView')));

const menuItemRoutes = {
  path: '/',
  children: [
    {
      index: true,
      element: <Login />
    },
    {
      path: 'login',
      element: <Login />
    },
{
    path: '/',
    element: <MainLayout />,
    children: [
         {
            index: true,  // 👈 this tells React Router to render this at "/"
            element: <DashboardDefault />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/all-emails',
            element: <AllEmails />
        },
        {
            path: '/top-priority-emails',
            element: <TopPriorityMails />
        },
        {
            path: '/replied-emails',
            element: <RepliedEmailsView />
        },
        {
            path: '/new-emails',
            element: <NewEmailsView />
        }]}
    ]
};

export default menuItemRoutes;