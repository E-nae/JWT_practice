import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import Drawer from './Drawer/index';
import Header from './Header/index';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { openDrawer } from 'store/reducers/menu';
import { RootState } from 'store';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state: RootState) => state.menu);

  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
  }, [matchDownLG, dispatch]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen, open]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {/** 260px */}
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ width: matchDownLG ? '100%' : 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 }, position: 'relative' }}
      >
        {/*** contents */}
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;

