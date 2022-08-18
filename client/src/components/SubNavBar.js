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
    <AppBar display="flex" position='inherit' style={{backgroundColor: "#484848"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{minHeight: 25}}>

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
              {props.pages.map((page) => (
                <MenuItem key={page.link} onClick={() => {navigate(page.link); handleCloseNavMenu() }}>
                  <Typography textAlign="center" style={{fontFamily: 'Avenir'}}>{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {props.pages.map((page) => (
              <div
                key={page.link}
                onClick={() => {navigate(page.link); handleCloseNavMenu()} }
                style={{fontFamily: 'Avenir', paddingLeft: 24, fontSize: 14, cursor: 'pointer', textDecoration: page.link === window.location.pathname ? 'underline' : 'none'}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.text}
              </div>
            ))}
          </Box>

          
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
