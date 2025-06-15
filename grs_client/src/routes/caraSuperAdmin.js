import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

//const RegisterGrievanceTemp = Loadable(lazy(() => import('views/Grievance/Grievance_Register/Register')));
// Cara Super-Admin Routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Login = Loadable(lazy(() => import('views/pages/authentication/login')));
// const RegisterNewUser = Loadable(lazy(() => import('views/caraSuperAdminViews/registerNewUser')));
// grievances reports
const AllEmails = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/allEmails')));
const TopPriorityMails = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/topPriorityMails')));
const RepliedEmailsView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/repliedEmailView')));
const NewEmailsView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/newEmailsView')));
// const ClosedGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/closedGrievancesView')));
// ==============================|| Cara Super-Admin ROUTING ||============================== //
const caraSuperAdminRoutes = {
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

export default caraSuperAdminRoutes;