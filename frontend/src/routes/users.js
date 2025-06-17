import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// Cara User Routing
const PageNotFoundPage = Loadable(lazy(() => import('components/common/PageNotFoundPage')));


// ==============================|| Cara User ROUTING ||============================== //

const caraUserRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '*',
            element: <PageNotFoundPage />
        },
    ]
};

export default caraUserRoutes;
