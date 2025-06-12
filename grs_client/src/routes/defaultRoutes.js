import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const Login = Loadable(lazy(() => import('views/pages/authentication/login')));
const Signup = Loadable(lazy(() => import('views/pages/authentication/signup')));
const VerifySignup = Loadable(lazy(() => import('views/pages/authentication/verifySignup')));
const PageNotFoundPage = Loadable(lazy(() => import('components/common/PageNotFoundPage')));

const defaultRoutes = {
  path: '/',
  children: [
    {
      index: true,  // <- this means default at "/"
      element: <Login />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'signup',
      element: <Signup />
    },
     {
      path: '/verify-signup',
      element: <VerifySignup />
    }
  ]
};


export default defaultRoutes;
