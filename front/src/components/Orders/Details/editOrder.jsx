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
    case 'client':
      return 'Клиент';
    case 'shop':
      return 'Магазин';
    case 'weight':
      return 'Вес заказа';
    default:
      return key;
  }
}

export default function EditClientModal({order={}, open, setEdit}) {
  const classes = useStyles();
  const cookies = new Cookies();
  const [load, setLoad] = React.useState(false);

  const handleClose = () => {
    setEdit(false);
  };

  const handleSubmitReg = (values) => {
    setLoad(true)
    !load && new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`http://${window.location.hostname}/order`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: cookies.get('sid'),
          },
          body: JSON.stringify({...values, _id: order._id})
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
      // dispatch(ACTION_ORDER.EDIT_ORDER(json));
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
            <Button type='submit' form='edit_order' autoFocus color="inherit">
              Редактировать
            </Button>
          </Toolbar>
          {load && <LinearProgress className={classes.load} />}
        </AppBar>

        <Box p={2}>
        <Formik
              initialValues={{
                client: '',
                shop: '',
                weight: '',
              }}
              validationSchema={
                Yup.object().shape({
                  client: Yup.object().required('Выберите клиента'),
                  shop: Yup.object().required('Выберите магазин'),
                  weight: Yup.object().required('Введите вес заказа'),
                })
              }
              onSubmit={(values, { setSubmitting }) => {
                  handleSubmitReg(values)
                  setSubmitting(false);
              }}
            >

              {({
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                values
              }) => (
                <form onSubmit={handleSubmit} id='edit_order'>
                  <Box mb={3}>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      Новый заказ
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
                  {Object.keys(values).map(el => <Input key={el} props={{values, setFieldValue, handleBlur, handleChange, key: el, label: label(el)}}/>)}
                </form>
              )}
            </Formik>
          </Box>
      </Dialog>
    </>
  );
}
