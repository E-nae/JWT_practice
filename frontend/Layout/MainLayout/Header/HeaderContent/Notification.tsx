import { useRef, useState, useEffect, memo } from 'react';
import { useSocket } from 'context/SocketContext';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
// import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { BellOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

interface Message {
  user: string;
  date: string;
}

/****** 시간 **/
const SecondaryAction = memo(({ time }: { time: string }) => {
  return (
    <Typography variant="caption" noWrap>
      {time}
    </Typography>
  );
});

SecondaryAction.displayName = 'SecondaryAction';

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { socketPro, socketDev } = useSocket();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!process.env.IS_DEV) {
      socketPro.on('message', (message: Message) => {
        // setMessage(message);
        setMessageList((prev) => prev.concat(message));
        console.log('message from server: ', message);
      });
    } else {
      socketDev.on('message', (message: Message) => {
        // setMessage(message);
        setMessageList((prev) => prev.concat(message));
        console.log('message from local server: ', message);
      });
    }
  }, [socketPro, socketDev]);

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  /** 분, 초 추출 */
  const getTime = (date: string) => {
    const msgDate = new Date(date);
    const min = String(msgDate.getHours()).padStart(2, '0');
    const sec = String(msgDate.getMinutes()).padStart(2, '0');
    return `${min}:${sec}`;
  };
  /** 분 차이 추출 */
  const differenceInMinutes = (msgTime: string) => {
    const nowDate = new Date();
    const msgDate = new Date(msgTime);
    const diffMsec = nowDate.getTime() - msgDate.getTime();
    const diffMin = diffMsec / (60 * 1000);
    const diffDate = diffMsec / (24 * 60 * 60 * 1000);
    const diff =
      Math.floor(diffDate) > 0 ? `${Math.floor(diffDate)} days ${Math.floor(diffMin)} min ago` : `${Math.floor(diffMin)} min ago`;
    return diff;
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={messageList?.length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="알림"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {messageList?.length > 0 &&
                      messageList?.map((message, idx) => (
                        <ListItem key={idx} secondaryAction={<SecondaryAction time={getTime(message.date)} />}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                color: 'success.main',
                                bgcolor: 'success.lighter'
                              }}
                            >
                              <MessageOutlined />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ pr: 3 }}>
                                {message.user}
                              </Typography>
                            }
                            secondary={differenceInMinutes(message?.date)}
                          />
                        </ListItem>
                      ))}
                    <Divider />
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;

