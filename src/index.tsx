import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './Pages/DashboardPage';
import ErrorPage from './Pages/ErrorPage';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './Store/Store';
import LoginPage from './Pages/LoginPage';
import { CompanyPage } from './Pages/CompanyPage';

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
        path: '/Dashboard',
        element: <DashboardPage/>,
        errorElement: <ErrorPage/>,
      },
      
      {
        path: '/Company',
        element:<CompanyPage/>,
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
