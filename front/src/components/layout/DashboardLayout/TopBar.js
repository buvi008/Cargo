import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 0,
  },
  popover: {
    padding: theme.spacing(2)
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const notifications = useSelector(state => state.notifications);
  const [unreads, setUnreads] = React.useState(notifications.length);

  React.useEffect(() => {
    setUnreads(notifications.length);
  }, [notifications])
  const cookies = new Cookies();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreads(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications' : undefined;

  return (
    <AppBar
      className={clsx(className)}
      elevation={0}
      {...rest}
    >
      <Toolbar className={classes.root}>
        <RouterLink to="/">
          {/* <Logo /> */}
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton color="inherit" onClick={handleClick}>
            <Badge
              badgeContent={unreads}
              color="secondary"
              variant="standard"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box className={classes.popover}>
              {!notifications.length && <Typography>Нет уведомлений</Typography>}
              {notifications.map((el, i) => (<Typography key={el+i}>{el}</Typography>))}
            </Box>
          </Popover>
          <IconButton color="inherit" onClick={() => cookies.remove('sid')&window.location.reload()}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
