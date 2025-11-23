import { styled, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { drawerWidth } from '../../../config';

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  boxShadow: 'none'
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: 0,
  borderRight: 'none',
  boxShadow: theme.customShadows.z1
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

interface MiniDrawerStyledProps {
  open?: boolean;
}

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<MiniDrawerStyledProps>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;

