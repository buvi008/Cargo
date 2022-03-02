import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  Hidden,
  Button,
  List,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  Bookmark as BookMark,
} from 'react-feather';
import NavItem from './NavItem';
import InputIcon from '@material-ui/icons/Input';
import Cookies from 'universal-cookie';


const items = [
  {
    href: '/clients',
    icon: UsersIcon,
    title: 'Клиенты'
  },
  {
    href: '/shops',
    icon: ShoppingBagIcon,
    title: 'Магазины'
  },
  {
    href: '/actives',
    icon: BookMark,
    title: 'Активные клиенты'
  },
  {
    href: '/orders',
    icon: BarChartIcon,
    title: 'Заказы'
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
    background: 'transparent',
    border: 'none'
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const cookies = new Cookies();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
          <Hidden lgUp>
          <Button
            color="inherit"
            onClick={() => cookies.remove('sid')&window.location.reload()}
          >
            <InputIcon />&nbsp; Выход
          </Button>
        </Hidden>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
