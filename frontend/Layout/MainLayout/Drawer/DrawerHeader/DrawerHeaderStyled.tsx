// material-ui
import { styled, Theme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| DRAWER HEADER - STYLED ||============================== //

interface DrawerHeaderStyledProps {
  open?: boolean;
  theme?: Theme;
}

const DrawerHeaderStyled = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<DrawerHeaderStyledProps>(({ theme, open }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'flex-start' : 'center',
  paddingLeft: theme.spacing(open ? 3 : 0)
}));

export default DrawerHeaderStyled;

