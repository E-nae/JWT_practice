import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
// import { Box, List, Typography } from '@mui/material';
import { List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavSubGroup = ({ item, level }) => {
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;
  // console.log(level);
  const navCollapse = item?.children?.map((menuItem) => {
    // console.log(`menuItem: `);
    // console.log(menuItem);

    switch (menuItem.type) {
      case 'collapse':
        return (
          // <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
          //   collapse - only available in paid version
          // </Typography>
          <NavCollapse key={menuItem.id} item={menuItem} level={level} parent={item} />
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={level} parent={item} />;
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
      // subheader={
      //   item.title &&
      //   drawerOpen && (
      //     <Box sx={{ pl: 3, mb: 1.5 }}>
      //       <Typography variant="subtitle2" color="textSecondary">
      //         {item.title}s
      //       </Typography>
      //       {/* only available in paid version */}
      //     </Box>
      //   )
      // }
      disablePadding={true}
      sx={{ mb: drawerOpen ? 0.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavSubGroup.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavSubGroup;
