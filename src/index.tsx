import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './Pages/DashboardPage';
import ErrorPage from './Pages/ErrorPage';
import { Provider } from 'react-redux';
import { store } from './Store/Store';
import WelcomePage from './Pages/WelcomePage';
import AdminPage from './Pages/AdminPage';
import ProfilePage from './Pages/ProfilePage';

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
        element: <WelcomePage/>,
        errorElement: <ErrorPage/>,
      },
      {
        path: '/Dashboard',
        element: <DashboardPage/>,
        errorElement: <ErrorPage/>,
      },
      {
        path: '/Admin',
        element: <AdminPage/>,
        errorElement: <ErrorPage/>,
      },
      {
        path:'/Profile',
        element:<ProfilePage/>,
        errorElement: <ErrorPage/>,
      }
    ]
  }
])
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
