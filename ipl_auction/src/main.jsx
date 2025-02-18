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
import { store } from './store/store.js'
import { Provider } from 'react-redux'

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
      },
      {
        path: '/team',
        element: <Team />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
