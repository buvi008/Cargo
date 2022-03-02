import React, {useState} from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import {useDispatch} from "react-redux";
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from "@material-ui/core/IconButton";
import Cookies from 'universal-cookie';
import * as ACTION_USER from '../redux/actions/action-user';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  IconButton: {
    padding: '0px'
  },
  danger: {
    color: '#dc3545',
  }
}));

const AuthView = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const dispatch = useDispatch();

  const handleLoginSubmit = async (values) => {
    new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`http://${window.location.hostname}/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(values)
        })
        if (res.status === 200) {
          return resolve(await res.json());
        }
        return reject(await {...res.json(), message: 'Неверный логин и пароль'});
      } catch (error) {
        return reject({...error, message: 'Попробуйте перезагрузить или войти позже'});
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
      setErrorAuth(err.message);
    })
  }


  const [showPassword, setShowPassword] = React.useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const [errorAuth, setErrorAuth] = useState('');

  return (<>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
        className={classes.root}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              login: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              login: Yup.string().max(30).required('Введите имя пользователя'),
              password: Yup.string().max(50).required('Введите пароль')
            })}
            // onSubmit={() => {
            //   navigate('/app/dashboard', { replace: true });
            // }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              touched,
              values
            }) => (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit(values);
              }}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Вход
                  </Typography>
                </Box>
                <Box
                  mt={3}
                  mb={1}
                >
                  {/* <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    Войдите по номеру телефона
                  </Typography> */}
                <Typography align='center' className={classes.danger}>{errorAuth}</Typography>

                </Box>
                <TextField
                  error={Boolean(touched.login && errors.login)}
                  fullWidth
                  helperText={touched.login && errors.login}
                  label="Имя пользователя"
                  margin="normal"
                  name="login"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.login}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Введите пароль"
                  margin="normal"
                  name="password"
                  id='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'><IconButton className={classes.IconButton} position="end" onClick={handleShowPassword}>
                        {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}</IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    aria-label='signin'
                    variant="contained"
                  >
                    Войти
                  </Button>
                </Box>
                {/* <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Нет аккаунта?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Зарегистрироваться
                  </Link>
                </Typography> */}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
}

export default AuthView;
