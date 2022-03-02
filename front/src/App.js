import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import AuthView from './components/AuthView';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from "@material-ui/core/CssBaseline";
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import * as ACTION_USER from './redux/actions/action-user';
import DashboardLayout from './components/layout/DashboardLayout';
import ClientsView from './components/Clients';
import ActivesView from './components/Actives';
import ShopsView from './components/Shops';
import OrdersView from './components/Orders';
import Wss from './components/Wss';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

function App() {
  const classes = useStyles();
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const dispatch = useDispatch();
  const login = useSelector(state => state.online);
  const cookies = React.useMemo(() => new Cookies(), []);
  const [cleanUp, setCleanUp] = React.useState(false);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          // type: prefersDarkMode ? 'dark' : 'light',
          type: 'dark',
        },
      }),
    [],
  );
  

  React.useEffect(() => {
    const sid = cookies.get('sid');
    console.log('APP')
    const is_me = () => {
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`http://${window.location.hostname}/is_me`, {
            method: 'POST',
            headers: {
              authorization: sid,
            },
          })
          if (res.status === 200) {
            return resolve(await res.json());
          }
          return reject(await res.json());
        } catch (error) {
          return reject(error);
        }
      })
      .then(json => {
        cookies.set('name', json.name, {expires: new Date(json.expires)});
        cookies.set('sid', json.accessToken, {expires: new Date(json.expires)});
        cookies.set('refresh', json.refreshToken, {expires: new Date(json.expires)});
        dispatch(ACTION_USER.CHANGE_ONLINE(true));
      })
      .catch(err => {
        console.log(err);
        cookies.remove('sid');
        cookies.remove('refresh');
        dispatch(ACTION_USER.CHANGE_ONLINE(false));
      })
    }
    if (!!(sid) && !login) is_me();
    return () => {
      setCleanUp(true);
      return;
    }
  }, [login, cookies, dispatch])
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {login ?
        <Router>
          <DashboardLayout />
          <div className={classes.wrapper}>
            <div className={classes.contentContainer}>
              <div className={classes.content}>
                <Switch>
                  <Route exact path='/clients'><ClientsView /></Route>
                  <Route exact path='/shops'><ShopsView /></Route>
                  <Route exact path='/actives'><ActivesView /></Route>
                  <Route exact path='/orders'><OrdersView /></Route>
                  
                  <Route exact path='/*'><Redirect to='/actives'/></Route>
                </Switch>
                {cleanUp && <Wss />}
              </div>
            </div>
          </div>
        </Router>
       :
       <AuthView />
      }
    </ThemeProvider>
  );
}

export default App;
