import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

//const RegisterGrievanceTemp = Loadable(lazy(() => import('views/Grievance/Grievance_Register/Register')));
// Cara Super-Admin Routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// const RegisterNewUser = Loadable(lazy(() => import('views/caraSuperAdminViews/registerNewUser')));
const ViewAllCaraUsers = Loadable(lazy(() => import('views/caraSuperAdminViews/viewAllCaraUsers')));
const RegisterGrievance = Loadable(lazy(() => import('views/caraSuperAdminViews/registerGrievance')));
// grievances reports
const AllGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/allEmails')));
const DistGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/distGrievancesView')));
const RepliedEmailsView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/repliedEmailView')));
const PushedbackGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/pushedbackGrievancesView')));
const ResolvedGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/resolvedGrievancesView')));
const ClosedGrievancesView = Loadable(lazy(() => import('views/caraSuperAdminViews/grievancesReports/closedGrievancesView')));
// ==============================|| Cara Super-Admin ROUTING ||============================== //

const caraSuperAdminRoutes = {
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
        // {
        //     path: '/registernewuser',
        //     element: <RegisterNewUser />
        // },
        {
            path: '/userreports/allusers',
            element: <ViewAllCaraUsers />
        },
        {
            path: '/regnewgrievance',
            element: <RegisterGrievance />
        },
        {
            path: '/reports/all-emails',
            element: <AllGrievancesView />
        },
        {
            path: '/reports/top-priority-emails',
            element: <DistGrievancesView />
        },
        {
            path: '/reports/replied-emails',
            element: <RepliedEmailsView />
        },
        {
            path: '/reports/pushbackedgrievanes',
            element: <PushedbackGrievancesView />
        },
        {
            path: '/reports/new-emails',
            element: <ResolvedGrievancesView />
        },
        {
            path: '/reports/unread-emails',
            element: <ClosedGrievancesView />
        }
    ]
};

export default caraSuperAdminRoutes;