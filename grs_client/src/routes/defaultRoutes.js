import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

const PageNotFoundPage = Loadable(lazy(() => import('components/common/PageNotFoundPage')));
// const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const PdfViewer = Loadable(lazy(() => import('views/common/PdfViewer')));

// ==============================|| DEFAULT ROUTING ||============================== //

const defaultRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '*',
            element: <PageNotFoundPage />
        },
        // {
        //     path: '/',
        //     element: <AuthLogin />
        // },
        // {
        //     path: '/',
        //     element: <AuthLogin />
        // },
        // {
        //     path: '/userAuth/login',
        //     element: <AuthLogin />
        // },
        {
            path: '/pdf/:filename',
            element: <PdfViewer />
        },
    ]
};

export default defaultRoutes;
