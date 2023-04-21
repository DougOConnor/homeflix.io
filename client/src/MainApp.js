import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import {useState, useEffect} from 'react'
import axios from 'axios'

import {
  readUserData
} from './utils/storage'
import TheaterLayoutEditor from './screens/InitialSetup/TheaterLayoutEditor';
import TheaterInfoEditor from './screens/InitialSetup/TheaterInfoEditor'
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';
import AdminCreate from "./screens/InitialSetup/AdminCreate";
import CheckoutScreen from './screens/CheckoutScreen'
import NowPlayingScreen from './screens/NowPlayingScreen';
import CheckoutConfirmation from "./screens/CheckoutConfirmationScreen";
import AddMovieScreen from './screens/Admin/AddMovieScreen'
import LoginScreen from './screens/LoginScreen'
import AdminScreen from './screens/Admin/AdminScreen'
import AddShowingDetailsScreen from './screens/Admin/AddShowingDetailsScreen'
import Navbar from './components/Navbar'
import AdminShowings from './screens/Admin/AdminShowingsScreen'
import AdminUsersScreen from './screens/Admin/AdminUsersScreen'
import AdminReservationsScreen from "./screens/Admin/AdminReservationsScreen";
import AdminNotificationsScreen from "./screens/Admin/AdminNotificationsScreen";

const primary = {
//light: '#e15166;',
main: '#0b69a2',
//dark: '#b9152d',
contrastText: '#fff',
}

const theme = createTheme({
typography: {
  fontFamily: [
    'Poppins',
  ].join(','),
},
palette: {
  mode: 'dark',
  primary: primary,
  secondary: {
    light: '#ff7961',
    main: '#f44336',
    dark: '#ba000d',
    contrastText: '#000',
  },
},
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 24,
        paddingRight: 24
      }
    }
  }
}
});

const lightTheme  = createTheme({
typography: {
  fontFamily: [
    'Poppins',
  ].join(','),
},
palette: {
  primary: primary
}
});
  
function MainApp(props) {
  const [user, setUser] = useState({})
  const [info, setInfo] = useState({})
  const navigate = useNavigate()

  const refreshApppInfo = () => {
    axios.get(
      '/api/v1/settings/app-info'
    ).then(response => {
      let data = response.data
      // handle redirects based on app info
      if (data.hasAdmin === false) {
        navigate("/setup/admin")
      } else if (data.hasInfo === false) {
        navigate("/setup/info")
      } else if (data.hasLayout === false) {
        navigate("/setup/layout")
      }
    })
  }

  useEffect(() => {
    let userData = readUserData() 
    refreshApppInfo()
    axios.get(
      '/api/v1/settings/info'
    ).then(response => {
      setInfo(response.data)
      document.title = response.data.theater_name
    })
    if (userData) {
      axios.get(
        '/api/v1/user',
        {
          headers: {
            "Authorization": "Bearer " + userData.token
          }
        }
      ).then(response => {
        setUser(response.data)
      })
    }
  }, [])
  
  return (
    <div style={{height: '100%'}}>
    <ThemeProvider theme={lightTheme}>
      <Routes>
        <Route path="/login" element={<LoginScreen setUser={setUser}  info={info}></LoginScreen>} />
        <Route path="/reset-password" element={<LoginScreen setUser={setUser}  info={info}></LoginScreen>}  />
      </Routes>
      </ThemeProvider>
      <ThemeProvider theme={theme}>
      {
        ["/login", "/reset-password"].indexOf(window.location.pathname) === -1 && <Navbar user={user} setUser={setUser} info={info}/>
      }
      
      <Routes>
        <Route path="/" element={<NowPlayingScreen/>} />
        <Route path='/checkout/confirmation' element={<CheckoutConfirmation/> } />
        <Route path="/checkout/:id" element={<CheckoutScreen />} />
        <Route path="/add-showing/:id" element={<AddShowingDetailsScreen />} />
        <Route path="/add-showing" element={<AddMovieScreen />} />
        <Route path="/setup/info" element={<TheaterInfoEditor refreshApppInfo={refreshApppInfo} />} />
        <Route path="/setup/layout" element={<TheaterLayoutEditor refreshApppInfo={refreshApppInfo}/>} />
        <Route path="/setup/admin" element={<AdminCreate setUser={setUser} refreshApppInfo={refreshApppInfo}/>}  />
        <Route path="/admin/showings" element={<AdminShowings />} />
        <Route path="/admin/theater-info" element={<AdminScreen/>} />
        <Route path="/admin/users" element={<AdminUsersScreen/>} />
        <Route path="/admin/reservations" element={<AdminReservationsScreen/>} />
        <Route path="/admin/notifications" element={<AdminNotificationsScreen/>} />
      </Routes>
      </ThemeProvider>
      </div>
  );
}

export default MainApp;
