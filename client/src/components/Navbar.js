import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { deleteUserData } from '../utils/storage';
import {useNavigate} from 'react-router-dom';



const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate()

  const pages = [
    {
      text: "NOW PLAYING",
      link: "/"
    }
  ];
  const settings = [
    {
      text: 'Add Showing',
      action: () => navigate("/add-showing"),
      admin: true
    },
    {
      text: 'Admin',
      action: () => navigate("/admin/theater-info"),
      admin: true
    },
    {
      text: 'Logout',
      action: () => {deleteUserData(); props.setUser(undefined)},
      admin: false
    }
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let user = props.user
  if (user === null || user === undefined) {
    user = {}
  }

  return (
    <AppBar position="static" >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            id='theater-name-desktop'
            variant="h6"
            noWrap
            component="div"
            style={{fontFamily: 'Avenir'}}
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <div onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
            {props.info.theaterName}
            </div>
            
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.link} onClick={() => {navigate(page.link); handleCloseNavMenu() }}>
                  <Typography textAlign="center" style={{fontFamily: 'Avenir'}}>{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            id='theater-name'
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            style={{fontFamily: 'Avenir', cursor: 'pointer'}}
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            {props.info.theaterName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <div
                key={page.link}
                onClick={() => {navigate(page.link); handleCloseNavMenu()} }
                style={{fontFamily: 'Avenir', paddingLeft: 24, fontSize: 14, cursor: 'pointer'}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.text}
              </div>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              user.username ? 
              <div>
              <Box sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
              <div onClick={handleOpenUserMenu} style={{ cursor: 'pointer' }}>
                <p style={{fontSize: 14}}>{user.username}</p>
              </div>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, cursor: 'pointer' }} onClick={handleOpenUserMenu} ><Avatar/></Box>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                  <Typography textAlign="center">{user.username}</Typography>
                </MenuItem>
              {settings.map((setting) => {
                if (setting.admin == false || (setting.admin == true && user.is_admin == 1)) {
                  return (
                    <MenuItem key={setting.text} onClick={() => {handleCloseUserMenu(); setting.action()} }>
                      <Typography textAlign="center">{setting.text}</Typography>
                    </MenuItem>
                  )
                }
                <MenuItem key={setting.text} onClick={setting.action}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
    })}
            </Menu>
            </div>
            :
            <div style={{cursor: 'pointer'}} onClick={() => {handleCloseUserMenu(); navigate("/login")}}>Login</div>
            }
              
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
