// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

interface MenuItem {
  id: string;
  type: string;
  [key: string]: any;
}

interface MenuItems {
  items: MenuItem[];
}

const Navigation = (arr: MenuItems, level: number) => {
  const navGroups = arr?.items?.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} level={level} />;
      default:
        console.log(`item: `);
        console.log(item);

        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;

