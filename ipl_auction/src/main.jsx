import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Landingpage } from '../src/pages/landingpage'
import Login from '../src/pages/login.jsx'
import Display from '../src/pages/display.jsx'
import RegistrationForm from '../src/pages/ragestration.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landingpage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/Registration',
        element: <RegistrationForm />
      },
      {
        path: '/players',
        element: <Display />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
