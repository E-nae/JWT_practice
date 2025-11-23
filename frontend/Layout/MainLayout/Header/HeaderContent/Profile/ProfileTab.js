import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
// import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import {
  EditOutlined,
  LogoutOutlined,
  ContainerOutlined,
  CommentOutlined,
  ProjectOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout, setOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index, to) => {
    event.preventDefault();
    setSelectedIndex(index);
    navigate(`/${to}`);
    setOpen(false);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      {/** 내 정보 변경 */}
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, 'myaccount')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="내 정보 변경" />
      </ListItemButton>

      {/** 히스토리 */}
      {/* <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, 'myhistory')}> */}
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={(event) => {
          event.preventDefault();
          alert('준비 중입니다');
        }}
      >
        <ListItemIcon>
          <ContainerOutlined />
        </ListItemIcon>
        <ListItemText primary="히스토리" />
      </ListItemButton>

      {/** 프로젝트 */}
      {/* <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}> */}
      <ListItemButton
        selected={selectedIndex === 3}
        onClick={(event) => {
          event.preventDefault();
          alert('준비 중입니다');
        }}
      >
        <ListItemIcon>
          <ProjectOutlined />
        </ListItemIcon>
        <ListItemText primary="프로젝트" />
      </ListItemButton>

      {/** 메신저 */}
      <ListItemButton
        selected={selectedIndex === 4}
        onClick={(event) => {
          event.preventDefault();
          alert('준비 중입니다');
        }}
      >
        {/* <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}> */}
        <ListItemIcon>
          <CommentOutlined />
        </ListItemIcon>
        <ListItemText primary="메신저" />
      </ListItemButton>

      {/** 문의하기 */}
      <ListItemButton selected={selectedIndex === 5} onClick={(event) => handleListItemClick(event, 5, 'contact')}>
        <ListItemIcon>
          <QuestionCircleOutlined />
        </ListItemIcon>
        <ListItemText primary="문의하기" />
      </ListItemButton>

      {/** 로그아웃 */}
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="로그아웃" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
  setOpen: PropTypes.func
};

export default ProfileTab;
