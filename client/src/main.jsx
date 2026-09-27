import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import { VotingProvider } from './context/VotingContext.jsx'
import VotingForm from './components/VotingForm.jsx';
import  Result  from './components/Result.jsx';
import HomePage from './components/HomePage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import NotFound from './components/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: '/Home',
    element: <PrivateRoute element={<HomePage />} />
  },
  {
    path: '/Vote',
    element: <PrivateRoute element={<VotingForm />}/>
  },
  {
    path: '/Result',
    element: <PrivateRoute element={<Result />}/>
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

createRoot(document.getElementById('root')).render(
  <VotingProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </VotingProvider>
)
