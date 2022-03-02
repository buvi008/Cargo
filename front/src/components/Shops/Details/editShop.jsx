import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import Input from './Input';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Cookies from 'universal-cookie';
import { LinearProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  addButton: {
    marginRight: theme.spacing(1)
  },
  load: {
    marginTop: theme.spacing(3),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const label = (key) => {
  switch(key) {
    case 'name':
      return 'Название магазина';
    case 'phone':
      return 'Номер телефона';
    case 'responsible':
      return 'Ответственное лицо';
    case 'city':
      return 'Город';
    case 'address':
      return 'Адрес';
    case 'info':
      return 'Дополнительно';
    case 'phone2':
      return 'Дополнительный номер';
    case 'url':
      return 'Ссылка для навигатора';
    default:
      return key;
  }
}

export default function EditShopModal({shop={}, open, handleShowEdit}) {
  const classes = useStyles();
  const cookies = new Cookies();
  const [load, setLoad] = React.useState(false);

  const handleSubmitReg = (values) => {
    setLoad(true)
    !load && new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`http://${window.location.hostname}/shop`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: cookies.get('sid'),
          },
          body: JSON.stringify({...values, _id: shop._id})
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
      // dispatch(ACTION_SHOP.EDIT_SHOP(json));
      handleShowEdit(false);
      setLoad(false);
    })
    .catch(err => {
      console.log(err);
      setLoad(false);
    })
  }

  console.log("EDIT SHOP")
  return (
    <>
      <Dialog fullScreen open={open} onClose={() => handleShowEdit(false)} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => handleShowEdit(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              CARGO
            </Typography>
            <Button type='submit' form='edit_shop' autoFocus color="inherit">
              Редактировать
            </Button>
          </Toolbar>
          {load && <LinearProgress className={classes.load} />}
        </AppBar>

        <Box p={2}>
          <Formik
              initialValues={{
                name: shop.name ?? '',
                responsible: shop.responsible ?? '',
                phone: shop.phone ?? '',
                phone2: shop.phone2 ?? '',
                city: shop.city ?? '',
                address: shop.address ?? '',
                images: shop.images ?? [],
                url: shop.url ?? '',
                info: shop.info ?? '',
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().min(1).max(100).required('Введите название магазина'),
                  responsible: Yup.string().min(1).max(100).required('Имя ответственного'),
                  phone: Yup.string().min(0).max(100).required('Номер телефона'),
                  phone2: Yup.string().min(0).max(100),
                  address: Yup.string().min(1).max(100).required('Адрес'),
                  images: Yup.mixed().required('Изображение'),
                  url: Yup.string().min(1).max(100),
                  info: Yup.string().min(0).max(300),
                })
              }
              onSubmit={(values, { setSubmitting }) => {
                handleSubmitReg(values);
                setSubmitting(false);
              }}
            >

              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit} id='edit_shop'>
                  <Box mb={3}>
                  <Typography
                      color="textPrimary"
                      variant="h4"
                    >
                      Редактирование
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body1"
                    >
                      {shop.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body1"
                    >
                      All fields are required
                    </Typography>
                  </Box>
                  <Divider />
                  <Grid container spacing={1}>
                    {Object.keys(values).filter(e=>e!=='images').map(el => <Input key={el} props={{touched, errors, values, handleBlur, handleChange, key: el, label: label(el)}}/>)}
                  </Grid>
                </form>
              )}
            </Formik>
          </Box>
      </Dialog>
    </>
  );
}
