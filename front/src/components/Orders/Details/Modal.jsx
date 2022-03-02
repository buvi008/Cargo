import React from 'react';
import {
  makeStyles,
  withStyles,
  Button,
  Dialog,
  IconButton,
  Box,
  Typography,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { removeOrder } from './edit';
import SelectStatus from './SelectStatus';
import Cookies from 'universal-cookie';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    textTransform: 'uppercase',
  },
  nested: {
    marginLeft: theme.spacing(1),
  },
  code: {
    alignSelf: 'center',
    marginBottom: 0,
  }
}))

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


export default function Modal({order={}, handleClose}) {
  const classes = useStyles();
  const cookies = new Cookies();
  const [load, setLoad] = React.useState(false);

  const handleRemove = () => {
    const answer = window.confirm(`Удалить заказ ${order?.title} (${order?.unit})`);
    if (!answer) return;
    removeOrder(order._id)
      .then(data => {
        // dispatch(ACTION_ORDER.REMOVE_ORDER(data))
      })
      .catch(err => console.log(err))
  };

  React.useEffect(() => {
    return () => {
      setLoad(false);
    }
  })

  const handleSubmit = () => {
    if (+order.status !== 4) return;
    setLoad(true);
    !load && new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`http://${window.location.hostname}/order`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: cookies.get('sid'),
          },
          body: JSON.stringify({close: true, order})
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
      setLoad(false);
    })
    .catch(err => {
      console.log(err);
      setLoad(false);
    })
  };

  return (<>
    <div>
      <Dialog maxWidth={'sm'} fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle className={classes.title} id="customized-dialog-title" onClose={handleClose}>
          {order?.title} ({order?.unit})
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography gutterBottom className={classes.code}>
              Код: <span style={{background: 'rgba(255, 0, 0, 0.7)', padding: '2px', borderRadius: '4px'}}>{order?.code}</span>
            </Typography>
            <SelectStatus order={order} />
          </Box>

          <Typography gutterBottom>
            Вес товара: {order?.unit} ({order?.weight})
          </Typography>
          <Typography gutterBottom>
            Статус: {window.formatStatus(order?.status, order?.title)}
          </Typography>
          <Typography gutterBottom>
            Состояние:
            <Typography variant='h6' component={'span'} style={{color: order?.isClosed ? 'red' : 'green'}}>
              {order.isClosed ? ' ЗАКРЫТ' : ' ОТКРЫТ'}
            </Typography>
          </Typography>
          
        </DialogContent>
        <DialogActions className={classes.buttonGroup}>
          <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <Button
              onClick={handleRemove}
              className={classes.button}
              variant='contained' 
              color="secondary"
              >
              Удалить
            </Button>
            {!order.isClosed && <Button 
              onClick={handleSubmit}
              className={classes.button}
              variant='contained' 
              color="primary"
              disabled={!(+order?.status === 4)}
            >
              Подтвердить
            </Button>}
          </Box>
          <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
            <Button onClick={handleClose} variant='outlined' color="default">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  </>);
}
