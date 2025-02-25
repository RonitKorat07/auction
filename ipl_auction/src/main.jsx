import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Homepage } from './pages/homepage.jsx'
import Login from '../src/pages/login.jsx'
import Player from './pages/player.jsx'
import RegistrationForm from '../src/pages/ragestration.jsx'
import Team from './pages/team.jsx'

import Footer from './components/footer.jsx'

import { store } from './store/store.js'
import { Provider } from 'react-redux'
import PlayerProfile from './pages/playerprofilepage.jsx'
import Auction from './pages/auction.jsx'
import Teamprofile from './pages/teamprofilepage.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <><Homepage /><Footer /></>
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
        element: <><Player /><Footer /></>
      },
      {
        path: '/team',
        element: <><Team /><Footer /></>
      }
      ,
      {
        path: '/playerprofile/:id',
        element: <><PlayerProfile /><Footer /></>
      },
      {
        path: '/teamprofile/:id',
        element: <><Teamprofile /><Footer /></>
      }
      ,
      {
        path: '/auction',
        element: <><Auction /><Footer /></>
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
