import React from 'react';
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
import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Thumb from './Image';

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
  input: {
    display: 'none',
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

export default React.memo(function InsertShopModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const cookies = new Cookies();
  const [load, setLoad] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      setLoad(false);
    }
  })

  const handleSubmitReg = (values) => {
    setLoad(true)
    !load && new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        // values.images.forEach(el => formData.append('images', el));
        // Object.keys(values).forEach(el => formData.append(el, values[el]));
        for (let i=0; i < values.images.length; i++) {
          formData.append('images', values.images[i]);
        }
        delete values.images;
        for (let key in values) {
          formData.append(key, values[key])
        }
        const res = await fetch(`http://${window.location.hostname}/shop`, {
          method: 'POST',
          headers: {
            Authorization: cookies.get('sid'),
          },
          body: formData
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
      // dispatch(ACTION_CLIENT.ADD_SHOP(json));
      handleClose();
      setLoad(false);
    })
    .catch(err => {
      console.log(err);
      setLoad(false);
    })
  }


  return (
    <>
        <Button onClick={handleClickOpen}
          className={classes.addButton}
          color="primary"
          variant="contained"
        >
          Новый магазин
        </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              CARGO
            </Typography>
            <Button type='submit' form='insert_shop' autoFocus color="inherit">
              Создать
            </Button>
          </Toolbar>
          {load && <LinearProgress className={classes.load} />}
        </AppBar>
        <Box p={2}>
          <Formik
              initialValues={{
                name: '',
                responsible: '',
                phone: '',
                phone2: '',
                city: '',
                address: '',
                images: [],
                url: '',
                info: '',
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().min(1).max(100).required('Введите название магазина'),
                  responsible: Yup.string().min(1).max(100).required('Имя ответственного'),
                  phone: Yup.string().min(0).max(100).required('Номер телефона'),
                  phone2: Yup.string().min(0).max(100),
                  city: Yup.string().min(1).max(100).required('Введите город'),
                  address: Yup.string().min(1).max(100).required('Введите адрес'),
                  images: Yup.mixed().required('Изображение'),
                  url: Yup.string().min(1).max(100),
                  info: Yup.string().min(0).max(300),
                })
              }
              onSubmit={(values, { setSubmitting }) => {
                  handleSubmitReg(values)
                  setSubmitting(false);
              }}
            >

              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit} id='insert_shop'>
                  <Box mb={3}>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      Новый магазин
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
                  <input
                    multiple
                    id="upload-images"
                    name="images"
                    type="file"
                    style={{display: 'none'}}
                    onChange={(event) => {
                      setFieldValue(
                        "images", event.currentTarget.files
                      );
                    }}
                  />
                  <div>
                    <label htmlFor="upload-images">
                      <Button color="default" aria-label="upload picture" component="span">
                        <PhotoCamera />&nbsp; Загрузить изображение
                      </Button>
                    </label>
                  </div>
                    {values.images && Object.keys(values.images).map((i) => (
                      <Thumb key={values.images[i].name} file={values.images[i]} />
                    ))}
                </form>
              )}
            </Formik>
          </Box>
      </Dialog>
    </>
  );
})
