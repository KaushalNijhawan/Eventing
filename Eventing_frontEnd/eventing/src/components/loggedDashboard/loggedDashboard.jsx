import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Person } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import store from '../../Redux/state/index';
import "./dasboard.css";
import EventModal from '../EventModal/eventModal';
import { useRef } from 'react';

const LoggedDashboard = () => {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const modalRef = useRef(null);
  const [currentUser, setCurrentUser] = useState('');
  useEffect(() => {
    if (store && store.getState() && store.getState().user) {
      console.log(store.getState());
      setCurrentUser(store.getState().user);
    }
  }, []);
const handleEventClick = ()=>{
  modalRef.current.handleError();
  modalRef.current.handleOpen();
}
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Eventing
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
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">Events</Typography>
                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Person> {currentUser.username}</Person>
                </Button>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Logout
                </Button>
              </div>
                </MenuItem>
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Eventing
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Events
              </Button>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Person> {currentUser.username}</Person>
                </Button>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Logout
                </Button>
              </div>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
      <div className="parent-box">
        <div className="box">
          <div className="modal-button">
            <Button variant="contained" onClick ={handleEventClick}>Create Event</Button>
          </div>
        </div>
        <EventModal ref ={modalRef} currentUser = {currentUser}/>
      </div>
    </div>
  );
}

export default LoggedDashboard;