import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
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

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {props.pages.map((page) => (
              <div
                variant="text"
                id={page.id}
                key={page.link}
                onClick={() => {navigate(page.link); handleCloseNavMenu()} }
                href={page.link}
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
