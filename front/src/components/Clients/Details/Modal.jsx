import React from 'react';
import {
  makeStyles,
  withStyles,
  Button,
  Dialog,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import ReorderIcon from '@material-ui/icons/Reorder';
// import { removeClient } from './edit';

// Modals
import InsertOrderModal from '../../Orders/Details/InsertOrder';
import EditClientModal from './editClient';
import ModalOrder from '../../Orders/Details/Modal';


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

const Item = React.memo(({el}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (<>
      {open && <ModalOrder order={el} handleClose={handleClose} />}
    <ListItem button className={classes.nested} onClick={handleClickOpen}>
      <ListItemIcon>
        <LabelImportantIcon />
      </ListItemIcon>
      <ListItemText primary={`${el?.title} (${el?.unit})`} />
      <Typography component={'span'} color={el?.isClosed ? 'primary' : 'secondary'}>
              {el.isClosed ? ' ЗАКРЫТ' : ' ОТКРЫТ'}
      </Typography>
    </ListItem></>
  )
})

export default function Modal({client, onlyshow, handleClose}) {
  console.log(client)
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(b=>!b);
  const [edit, setEdit] = React.useState(false);
  const handleShowEdit = (bool) => setEdit(bool);

  // const handleRemove = () => {
  //   const answer = window.confirm(`Удалить клиента ${client.name} ${client.code}`);
  //   if (!answer) return;
  //   removeClient(client._id)
  //     // .then(data => dispatch(ACTION_CLIENT.REMOVE_CLIENT(data)))
  //     .catch(err => console.log(err))
  // };

  return (<>
    <div>
      {edit && <EditClientModal client={client} open={edit} handleShowEdit={handleShowEdit} />}
    </div>
    <div>
      <Dialog maxWidth={'sm'} fullWidth onClose={handleClose} aria-labelledby="dialog-title" open={true}>
        <DialogTitle className={classes.title} id="dialog-title" onClose={handleClose}>
          {client.name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Телефон: {client.phone}
          </Typography>
          <Typography gutterBottom>
            Адрес: {client.city}, {client.address}
          </Typography>
          <Typography gutterBottom>
            Код: <span style={{background: 'rgba(255, 0, 0, 0.7)'}}>{client.code}</span>
          </Typography>
          <Typography gutterBottom>
            Заказы: {client.active_count} / {client.orders.length}
          </Typography>
          <Typography gutterBottom>
            {client.info}
          </Typography>
          <List>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <ReorderIcon />
              </ListItemIcon>
              <ListItemText primary={`Активные заказы (${client.orders.length})`} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {client.orders.map(el => <Item key={el?._id ?? el} el={el} />)}
              </List>
            </Collapse>
          </List>
        </DialogContent>
        {!onlyshow && <DialogActions className={classes.buttonGroup}>
          <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <Button 
              onClick={() => handleShowEdit(true)} 
              className={classes.button}
              variant='contained' 
              color="primary"
            >
              Изменить
            </Button>
            <InsertOrderModal client={client} />
          </Box>
          <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
            <Button onClick={handleClose} variant='outlined' color="default">
              Close
            </Button>
          </Box>
        </DialogActions>}
      </Dialog>
    </div>
  </>);
}
