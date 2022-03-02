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
      return 'ФИО';
    case 'phone':
      return 'Номер телефона';
    case 'city':
      return 'Название города';
    case 'address':
      return 'Адрес';
    case 'info':
      return 'Дополнительно';
    default:
      return key;
  }
}

export default function EditClientModal({client={}, open, handleShowEdit}) {
  const classes = useStyles();
  const cookies = new Cookies();
  const [load, setLoad] = React.useState(false);

  const handleClose = () => {
    handleShowEdit(false);
  };

  const handleSubmitReg = (values) => {
    setLoad(true)
    !load && new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`http://${window.location.hostname}/client`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: cookies.get('sid'),
          },
          body: JSON.stringify({...values, _id: client._id})
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
      // dispatch(ACTION_CLIENT.EDIT_CLIENT(json));
      handleClose();
      setLoad(false);
    })
    .catch(err => {
      console.log(err);
      setLoad(false);
    })
  }

  console.log("EDIT COMPONENT")
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              CARGO
            </Typography>
            <Button type='submit' form='edit_client' autoFocus color="inherit">
              Редактировать
            </Button>
          </Toolbar>
          {load && <LinearProgress className={classes.load} />}
        </AppBar>

        <Box p={2}>
          <Formik
              initialValues={{
                name: client.name ?? '',
                phone: client.phone ?? '',
                city: client.city ?? '',
                address: client.address ?? '',
                info: client.info ?? '',
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().min(1).max(100).required('Введите ФИО'),
                  phone: Yup.string().min(0).max(100).required('Введите номер телефона'),
                  city: Yup.string().min(1).max(100).required('Название города'),
                  address: Yup.string().min(1).max(100).required('Адрес'),
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
                isSubmitting,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit} id='edit_client'>
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
                      {client.name}
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
                  {Object.keys(values).map(el => <Input key={el} props={{touched, errors, values, handleBlur, handleChange, key: el, label: label(el)}}/>)}
                </form>
              )}
            </Formik>
          </Box>
      </Dialog>
    </>
  );
}
