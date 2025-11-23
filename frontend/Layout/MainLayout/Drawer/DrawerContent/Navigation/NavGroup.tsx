import { useSelector } from 'react-redux';
import { List, Typography } from '@mui/material';
import { RootState } from 'store';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface NavItemType {
  id: string;
  type: string;
  children?: NavItemType[];
  [key: string]: any;
}

interface NavGroupProps {
  item: NavItemType;
  level: number;
}

const NavGroup = ({ item, level }: NavGroupProps) => {
  const menu = useSelector((state: RootState) => state.menu);
  const { drawerOpen } = menu;

  const navCollapse = item?.children?.map((menuItem) => {
    // console.log(`menuItem: `);
    // console.log(menuItem);

    switch (menuItem.type) {
      case 'collapse':
        return (
          // <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
          //   collapse - only available in paid version
          // </Typography>
          <NavCollapse key={menuItem.id} item={menuItem} level={level} />
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={level} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
      disablePadding={true}
    >
      {navCollapse}
    </List>
  );
};

export default NavGroup;

