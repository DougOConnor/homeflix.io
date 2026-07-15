import {BrowserRouter, Route, Routes, Navigate, useNavigate, useHref, useLocation} from 'react-router-dom';
import {HeroUIProvider} from '@heroui/react';
import LandingScreen from './screens/LandingScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import Sidebar from './components/Sidebar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';

import NowPlayingScreen from './screens/NowPlayingScreen';
import MyTicketsScreen from './screens/MyTicketsScreen';
import TicketScreen from './screens/TicketScreen';
import ScanTicketScreen from './screens/Admin/ScanTicketScreen';
import SnacksScreen from './screens/Admin/SnacksScreen';
import EmailSettingsScreen from './screens/Admin/EmailSettingsScreen';
import ShowingDetailsScreen from './screens/ShowingDetailsScreen';
import AdminAddMovieScreen from './screens/Admin/AddMovieScreen';
import AdminAddMovieScreen2 from './screens/Admin/AddMovieScreen2';
import CheckoutScreen from './screens/Checkout';
import AdminCreate from './screens/InitialSetup/AdminCreate';
import TheaterInfoEditor from './screens/InitialSetup/TheaterInfoEditor';
import TheaterLayoutEditor from './screens/InitialSetup/TheaterLayoutEditor';
import CheckoutConfirmation from './screens/CheckoutConfirmationScreen';
import TheaterInfoScreen from './screens/Admin/TheaterInfoScreen';

import { theaterIcon } from './utils/branding';

import 'react-toastify/dist/ReactToastify.css';

import './App.css';


// SPA navigation keeps the scroll position by default — always start new
// screens at the top.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lives inside BrowserRouter so HeroUI links can use client-side routing
// (plain hrefs cause a full page reload on every navigation).
function AppShell() {
  const navigate = useNavigate();
  const useHrefFn = useHref;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [theaterInfo, setTheaterInfo] = useState({
  });

  const logout = () => {
    axios.post('/api/v1/auth/logout').then((response) => {
      setUser({})
      setIsLoggedIn(false);
      window.location.replace("/");
    }).catch((error) => {
      console.log(error);
    });

  }

  const fetchTheaterInfo = () => {
    axios.get('/api/v1/settings/info').then((response) => {
      setTheaterInfo(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  const login = () => {
    fetchUserData();
  }

  const fetchUserData = () => {
    axios.get('/api/v1/user').then((response) => {
      setUser(response.data);
      setIsLoggedIn(true);
    }).catch((error) => {
      setIsLoggedIn(false);
      setUser({});
    });
  }

  useEffect(() => {
      // Dark theme on the root element so portaled overlays (modals,
      // popovers) pick it up too — they render outside <main>.
      document.documentElement.classList.add('dark');
      fetchUserData();
      fetchTheaterInfo();
      // First-run setup: send fresh installs through the wizard
      axios.get('/api/v1/settings/app-info').then((response) => {
        const info = response.data;
        let step = null;
        if (!info.hasAdmin) step = '/setup/admin';
        else if (!info.hasInfo) step = '/setup/info';
        else if (!info.hasLayout) step = '/setup/layout';
        if (step && !window.location.pathname.startsWith('/setup')) {
          navigate(step, { replace: true });
        }
      }).catch((error) => {
        console.log(error);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the browser tab in sync with the theater's branding
  useEffect(() => {
    if (theaterInfo.theater_name) {
      document.title = theaterInfo.theater_name;
    }
    const icon = theaterIcon(theaterInfo);
    const [prefix, name] = icon.split(':');
    if (prefix && name) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/svg+xml';
      link.href = `https://api.iconify.design/${prefix}/${name}.svg?color=%23d92637`;
    }
  }, [theaterInfo]);

  const sidebarItems = {
    showings: {
      icon: "solar:clapperboard-play-linear",
      title: "Showings",
      path: "/admin/showings",
    },
    scanTicket: {
      icon: "solar:qr-code-linear",
      title: "Scan Ticket",
      path: "/admin/scan",
    },
    snacks: {
      icon: "solar:chef-hat-linear",
      title: "Snacks",
      path: "/admin/snacks",
    },
    email: {
      icon: "solar:letter-linear",
      title: "Email",
      path: "/admin/email",
    },
    theaterInfo: {
      icon: "solar:settings-linear",
      title: "Theater Info",
      path: "/admin/theater-info",
    }
  }

  const AppNavbar = () => {
    return (
      <Navbar info={theaterInfo} user={user} logout={logout}  />
    )
  }

  return (
    <HeroUIProvider navigate={navigate} useHref={useHrefFn}>
      <main className="dark text-foreground bg-background min-h-screen">
        <ScrollToTop />
        <ToastContainer theme="dark" />
        <Routes>
        <Route path="/login" element={<LandingScreen logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} info={theaterInfo} />} />
        <Route path="/" element={<><AppNavbar /><NowPlayingScreen logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} /></>} />
        <Route path="/showing/:id" element={<><AppNavbar /><ShowingDetailsScreen /></>} />
        <Route path="/admin/snacks" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><SnacksScreen/></Sidebar>} />
        <Route path="/admin/email" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><EmailSettingsScreen/></Sidebar>} />
        <Route path="/my-tickets" element={<><AppNavbar /><MyTicketsScreen user={user} /></>} />
        <Route path="/my-tickets/:id" element={<><AppNavbar /><TicketScreen user={user} /></>} />
        <Route path="/admin/scan" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><ScanTicketScreen/></Sidebar>} />
        <Route path="/password-reset" element={<PasswordResetScreen info={theaterInfo} />} />
        <Route path="/admin/showings" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><AdminAddMovieScreen/></Sidebar>} />
        <Route path="/admin/add-movie/:id" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><AdminAddMovieScreen2/></Sidebar>} />
        <Route path="/admin/theater-info" element={<Sidebar logout={logout} isLoggedIn={isLoggedIn} user={user} login={login} sidebarItems={sidebarItems} info={theaterInfo}><TheaterInfoScreen refreshInfo={fetchTheaterInfo}/></Sidebar>} />
        <Route path='/checkout/confirmation' element={<><AppNavbar /><CheckoutConfirmation/></> } />
        <Route path="/checkout/:id" element={<><AppNavbar /><CheckoutScreen user={user} /></>} />
        <Route path="/setup/admin" element={<AdminCreate onLogin={login} />} />
        <Route path="/setup/info" element={<TheaterInfoEditor refreshInfo={fetchTheaterInfo} />} />
        <Route path="/setup/layout" element={<TheaterLayoutEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HeroUIProvider>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}


export default App;
