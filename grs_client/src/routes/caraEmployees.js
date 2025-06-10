import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

//const RegisterGrievanceTemp = Loadable(lazy(() => import('views/Grievance/Grievance_Register/Register')));
// Cara Super-Admin Routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const ResolvedGrievancesView = Loadable(lazy(() => import('views/caraEmployeeViews/grievancesReports/resolvedGrievancesView')));
const UnResolvedGrievancesView = Loadable(lazy(() => import('views/caraEmployeeViews/grievancesReports/unresolvedGrievancesView')));
// const ClosedGrievancesView = Loadable(lazy(() => import('views/caraEmployeeViews/grievancesReports/closedGrievancesView')));

const PdfViewer = Loadable(lazy(() => import('views/common/PdfViewer')));
// ==============================|| Cara Super-Admin ROUTING ||============================== //

const caraEmployeesRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
         {
            index: true,  // 👈 this tells React Router to render this at "/"
             path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/reports/new-emails',
            element: <ResolvedGrievancesView />
        },
        {
            path: '/reports/unresolvedgrievanes',
            element: <UnResolvedGrievancesView />
        },
        // {
        //     path: '/reports/unread-emails',
        //     element: <ClosedGrievancesView />
        // },
        {
            path: '/pdf/:filename',
            element: <PdfViewer />
        }
    ]
};

export default caraEmployeesRoutes;
