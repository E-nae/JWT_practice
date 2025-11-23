import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project import
import { activeItem } from 'store/reducers/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { drawerOpen, openItem } = useSelector((state) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (code) => {
    dispatch(activeItem({ openItem: [code] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '.4rem' : '.4rem' }} /> : false;

  const isSelected = openItem.findIndex((code) => code === item.code) > -1;
  // console.log(isSelected);
  // active menu item on page load
  useEffect(() => {
    /** 현재 메뉴 그룹 선택 상태 유지 */
    const findCurrCode = (items) => {
      let code;
      code = `/${items?.url}` === pathname ? items?.code : undefined;

      if (!code) {
        items?.children?.map((item) => {
          console.log('item?.url: ');
          console.log(item?.url);

          code = findCurrCode(item);
          if (code) return code;
        });
      }
      if (code) return code;
    };

    const currCode = findCurrCode(item);
    if (currCode) {
      dispatch(activeItem({ openItem: [currCode] }));
    }
    // if (pathname.includes(item.url)) {
    //   dispatch(activeItem({ openItem: [item.code] }));
    // }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.code)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        // py: !drawerOpen && level === 1 ? 1.25 : 1,
        py: 0,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: 'primary.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'primary.lighter'
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: theme.palette.error.main,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography
              sx={{
                color: isSelected ? iconSelectedColor : textColor,
                fontSize: level === 1 ? '0.875rem' : `0.8rem`
              }}
            >
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
