import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import Main from './Component/Main.jsx';
import Admin from './pages/Admin.jsx';
import Student from './pages/Student.jsx';
import Result from './Component/student/Result.jsx';
import Complain from './Component/student/Complain.jsx';
import Attendence from './Component/student/Attendence.jsx';
import Layout from './Routes/Layout.jsx';
import Faculty from './Component/admin/Facuity/Faculty.jsx';
import S1 from './Component/admin/Students/S1.jsx';
import Adminlayout from './Routes/Adminlayout.jsx';
import Classes from './Component/admin/Students/Classes.jsx';
import ClassesLayout from './Routes/ClassesLayout.jsx';
import Form from './Component/admin/Students/Form.jsx';
import Classaddlayout from './Routes/Classaddlayout.jsx';
import Login from './Component/admin/Login.jsx';
import LoginLayout from './Routes/LoginLayout.jsx';
import Protected from './Routes/Protected.jsx';
import Details from './Component/admin/Students/Details.jsx';
import Delete from './Component/admin/Students/Delete.jsx';
import Annunosment from './Component/admin/Students/Annunosment.jsx';
import Update from './Component/admin/Students/Update.jsx';
import Studentlog from './Component/student/Studentlog.jsx';

import First from './Component/student/Chart/First.jsx';
import { UserProvider } from './Component/student/UserContext.jsx';
import Protect from './Component/admin/Protect.jsx';
import Smart from './Component/student/AiGURU/Smart.jsx';
import Complaint from './Component/admin/Students/Complaint.jsx';
import AdminRoutes from "./Routes/adminRoutes.jsx";
import FacuiltyRoutes from "./Routes/FacuiltyRoutes.jsx" // Corrected import
import cnt from '../Apolloclient.jsx';
import Faclogin from './Component/admin/Facuity/Faclogin.jsx';
import Fprotect from './Component/admin/Facuity/Fprotect.jsx';
import AdminLogin from './Component/admin/Administrative/AdminLogin.jsx';

// Import ErrorBoundary

const router = createHashRouter([

  {
    path: '/',
    element: <LoginLayout />,
    children: [
      {
        path: "",
        element: <Admin /> // This is your portal selection page with two cards
      },
      
      // Administrative login and routes
      {
        path: 'AdministrativeAuth',
        element: <AdminLogin /> // No children here - this is just the login page
      },
     
      // Faculty login and routes
      {
        path: 'FacilityAuth',
        element: <Faclogin /> // No children here - this is just the login page
      },
 
    ]
  },

  {
path:"/Administrative/*",
element: <Protected><AdminRoutes /></Protected>
  },
  {
    path: '/Facility/*', // This will match all Facility routes
    element: <Fprotect><FacuiltyRoutes /></Fprotect>
  },
  {
    path: '/Student',
    element: <Protect><Layout/></Protect>,

    children: [
      {
        path: '',
        element: <First />
      },
      {
        path: 'result',
        element: <Result />
      },
      {
        path: 'Home',
        element: <First />
      },
      {
        path: 'Attendence',
        element: <Attendence />
      },
      {
        path: 'complain',
        element: <Complain />
      },
      {
        path: 'Aiguru',
        element: <Smart/>
      }
    ]
  }
]);


<cnt/>
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={cnt}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ApolloProvider>
  </StrictMode>
);