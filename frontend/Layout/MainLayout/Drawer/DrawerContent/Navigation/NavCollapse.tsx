import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, Stack, List } from '@mui/material';
import { activeItem } from 'store/reducers/menu';
import NavGroup from './NavGroup';
import { RootState } from 'store';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface NavItemType {
  id: string;
  code: string;
  url?: string;
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

interface NavCollapseProps {
  item: NavItemType;
  level: number;
  parent?: NavItemType;
}

const NavCollapse = ({ item, level }: NavCollapseProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const childrenRef = useRef<HTMLUListElement>(null);

  const { drawerOpen, openItem } = useSelector((state: RootState) => state.menu);
  const itemHandler = (code: string) => {
    dispatch(activeItem({ openItem: [code] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '.5rem' : '.5rem' }} /> : false;
  /** item.code(대메뉴의 메뉴 코드)로 시작하는 코드(하위 메뉴) 식별 정규식 */
  const regex = new RegExp('^' + item.code);
  /** 클릭한 메뉴 또는 하위메뉴 식별 */
  const isSelected = openItem.findIndex((code) => code === item.code || regex.test(code)) > -1; // true, false
  // console.log(isSelected);

  /** 메뉴 그룹 펼치기/접기 */
  const [unfold, setUnfold] = useState(isSelected);

  // /** 메뉴 그룹 펼치기/접기 */

  // active menu item on page load
  useEffect(() => {
    /** 현재 메뉴 그룹 펼침 상태 유지 */
    const findCurrCode = (items: NavItemType): string | undefined => {
      let code: string | undefined;
      code = item.url && `/${items?.url}` === pathname ? items?.code : undefined;

      if (!code && items.children) {
        items.children.forEach((childItem) => {
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
      setUnfold(true);
    }

  }, [pathname, item, dispatch]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <Stack>
      <ListItemButton
        // {...listItemProps}
        disabled={item.disabled}
        onClick={() => {
          itemHandler(item.code);
          setUnfold(!unfold);
          // console.log(item.children);
        }}
        selected={isSelected}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          // py: !drawerOpen && level === 1 ? 0 : 0,
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
              color: theme.palette.primary.main,
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
              /** variant="h6" */
              <Typography
                sx={{ color: isSelected ? iconSelectedColor : textColor, fontSize: level === 1 ? '0.875rem' : `${level * 0.5}rem` }}
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
      {unfold && (
        <List disablePadding={true} ref={childrenRef}>
          <NavGroup item={item} level={level * 1.5} />
        </List>
      )}
    </Stack>
  );
};

export default NavCollapse;

