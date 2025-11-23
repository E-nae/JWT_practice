// project import
// import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import MenuItems from 'menu-items';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const menuItem = MenuItems();
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {Navigation(menuItem, 1)}
      {/* <NavCard /> */}
    </SimpleBar>
  );
};

export default DrawerContent;
