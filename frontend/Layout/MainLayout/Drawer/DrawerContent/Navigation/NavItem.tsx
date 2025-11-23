import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { activeItem } from 'store/reducers/menu';
import { RootState } from 'store';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface NavItemType {
  id: string;
  code: string;
  url: string;
  title: string;
  icon?: React.ComponentType<any>;
  target?: string;
  external?: boolean;
  disabled?: boolean;
  chip?: {
    color: string;
    variant: string;
    size: string;
    label: string;
    avatar?: string;
  };
  children?: NavItemType[];
}

interface NavItemProps {
  item: NavItemType;
  level: number;
  parent?: NavItemType;
}

const NavItem = ({ item, level }: NavItemProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { drawerOpen, openItem } = useSelector((state: RootState) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps: any = { component: forwardRef<HTMLAnchorElement>((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (code: string) => {
    dispatch(activeItem({ openItem: [code] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '.4rem' : '.4rem' }} /> : false;

  const isSelected = openItem.findIndex((code) => code === item.code) > -1;
  // console.log(isSelected);
  // active menu item on page load
  useEffect(() => {
    /** 현재 메뉴 그룹 선택 상태 유지 */
    const findCurrCode = (items: NavItemType): string | undefined => {
      let code: string | undefined;
      code = `/${items?.url}` === pathname ? items?.code : undefined;

      if (!code && items.children) {
        items.children.forEach((childItem) => {
          console.log('item?.url: ');
          console.log(childItem?.url);

          const foundCode = findCurrCode(childItem);
          if (foundCode) code = foundCode;
        });
      }
      if (code) return code;
      return undefined;
    };

    const currCode = findCurrCode(item);
    if (currCode) {
      dispatch(activeItem({ openItem: [currCode] }));
    }
    // if (pathname.includes(item.url)) {
    //   dispatch(activeItem({ openItem: [item.code] }));
    // }
    // eslint-disable-next-line
  }, [pathname, item, dispatch]);

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
          color={item.chip.color as any}
          variant={item.chip.variant as any}
          size={item.chip.size as any}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;

