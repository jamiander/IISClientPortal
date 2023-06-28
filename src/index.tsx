import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import InitiativesPage from './Pages/InitiativesPage';
import ErrorPage from './Pages/ErrorPage';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './Store/Store';
import LoginPage from './Pages/LoginPage';
import UsersPage from './Pages/UsersPage';
import { ClientPage } from './Pages/ClientPage';
import { IntegrityPage } from './Pages/IntegrityPage';
import { DashboardPage } from './Pages/DashboardPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children:[
      {
        index: true,
        path: '/Login',
        element: <LoginPage/>,
        errorElement: <ErrorPage/>,
      },
      {
        path: '/Initiatives',
        element: <InitiativesPage/>,
        errorElement: <ErrorPage/>,
      },
      {
        path: '/Users',
        element: <UsersPage/>,
        errorElement: <ErrorPage/>
      },
      {
        path: '/Integrity',
        element: <IntegrityPage/>,
        errorElement: <ErrorPage/>
      },
      {
        path: '/ClientPage',
        element: <ClientPage/>,
        errorElement: <ErrorPage/>
      },
      {
        path: '/Dashboard',
        element: <DashboardPage/>,
        errorElement: <ErrorPage/>
      }
    ]
  }
])
root.render(
  <>
    <ReduxProvider store={store}>
      <RouterProvider router={router}/>
    </ReduxProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
