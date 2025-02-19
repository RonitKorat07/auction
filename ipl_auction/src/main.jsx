import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Landingpage } from '../src/pages/landingpage'
import Login from '../src/pages/login.jsx'
import Display from '../src/pages/display.jsx'
import RegistrationForm from '../src/pages/ragestration.jsx'
import Team from './pages/team.jsx'
import Footer from './components/footer.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <><Landingpage /><Footer/></>
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
        element: <><Display /><Footer/></>
      },
      {
        path: '/team',
        element: <><Team/><Footer/></>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
