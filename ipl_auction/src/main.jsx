import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Homepage } from "./pages/homepage.jsx";
import Login from "../src/pages/login.jsx";
import Player from "./pages/player.jsx";
import RegistrationForm from "../src/pages/ragestration.jsx";
import Team from "./pages/team.jsx";

import Footer from "./components/footer.jsx";

import { store } from "./store/store.js";
import { Provider } from "react-redux";
import PlayerProfile from "./pages/playerprofilepage.jsx";
import Auction from "./pages/auction.jsx";
import Teamprofile from "./pages/teamprofilepage.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import PlayerList from "./admin/players.jsx";

import Teamdashboard from "./team/teamdashboard.jsx";
import Squad from "./team/squad.jsx";
import Adminteam from "./admin/team.jsx";
import Adminauction from "./admin/auction.jsx";
import Auctionhandel from "./admin/auctionhandel.jsx";
import Auctionlist from "./pages/auctionlist.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Homepage />
            <Footer />
          </>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/Registration",
        element: <RegistrationForm />,
      },
      {
        path: "/players",
        element: (
          <>
            <Player />
            <Footer />
          </>
        ),
      },
      {
        path: "/teampage",
        element: (
          <>
            <Team />
            <Footer />
          </>
        ),
      },
      {
        path: "/playerprofile/:id",
        element: (
          <>
            <PlayerProfile />
            <Footer />
          </>
        ),
      },
      {
        path: "/teamprofile/:id",
        element: (
          <>
            <Teamprofile />
            <Footer />
          </>
        ),
      },
      {
        path: "/auction",
        element: (
          <>
            <Auctionlist />
            <Footer />
          </>
        ),
      },
      {
        path: "/auctionpage",
        element: (
          <>
            <Auction />
            <Footer />
          </>
        ),
      },
      {
        path: "/admin",
        element: (
          <>
            <App />
          </>
        ),
        children: [
          {
            path: "/admin",
            element: (
              <>
                <Dashboard />
                <Footer />
              </>
            ),
          },
          ,
          {
            path: "/admin/players",
            element: (
              <>
                <PlayerList />
                <Footer />
              </>
            ),
          },
          {
            path: "/admin/teampage",
            element: (
              <>
                <Adminteam />
                <Footer />
              </>
            ),
          },
          {
            path: "/admin/auction",
            element: (
              <>
                <Adminauction />
                <Footer />
              </>
            ),
          },{
            path: "/admin/auction/auctionhandel",
            element: (
              <>
                <Auctionhandel />
                <Footer />
              </>
            ),
          },
        ],
      },
      {
        path: "/team",
        element: (
          <>
            <App />
          </>
        ),
        children: [
          {
            path: "/team",
            element: (
              <>
                <Teamdashboard />
                <Footer />
              </>
            ),
          },
          {
            path: "/team/players",
            element: (
              <>
                <PlayerList />
                <Footer />
              </>
            ),
          },
          {
            path: "/team/squad",
            element: (
              <>
                <Squad />
                <Footer />
              </>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
