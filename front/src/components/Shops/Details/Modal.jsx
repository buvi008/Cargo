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
  Collapse,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import ReorderIcon from '@material-ui/icons/Reorder';
// import { removeShop } from './edit';

// Modals
import EditShopModal from './editShop';
import InsertOrderModal from '../../Orders/Details/InsertOrder';
import ModalClient from '../../Clients/Details/Modal';


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
    {open && <ModalClient client={el} onlyshow handleClose={handleClose} />}
    <ListItem button className={classes.nested} onClick={handleClickOpen}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary={`${el?.name} ( ${el?.code} )`} />
    </ListItem></>
  )
})

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

export default function Modal({shop, handleClose}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(b=>!b);
  const [edit, setEdit] = React.useState(false);
  const handleShowEdit = (bool) => setEdit(bool);

  // const handleRemove = () => {
  //   const answer = window.confirm(`Удалить ${shop.name} ${shop.address}`);
  //   if (!answer) return;
  //   removeShop(shop._id)
  //     .then(data => {
  //       // dispatch(ACTION_SHOP.REMOVE_SHOP(data))
  //     })
  //     .catch(err => console.log(err))
  // };

  return (<>
    <div>
      {edit && <EditShopModal shop={shop} open={edit} handleShowEdit={handleShowEdit} />}
    </div>
    <div>
      <Dialog maxWidth={'sm'} fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle className={classes.title} id="customized-dialog-title" onClose={handleClose}>
          {shop.name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            phone: {shop.phone}
          </Typography>
          {shop.phone2 &&
            <Typography gutterBottom>
              Дополнительный номер: {shop.phone2}
            </Typography>
          }
          <Typography gutterBottom>
            address: {shop.address}
          </Typography>
          <Typography gutterBottom>
            Ответственный: {shop.responsible}
          </Typography>
          <Typography gutterBottom>
            Код: <span style={{background: 'rgba(255, 0, 0, 0.7)'}}>{shop.code}</span>
          </Typography>
          <Typography gutterBottom>
            {shop.info}
          </Typography>
          <List>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <ReorderIcon />
              </ListItemIcon>
              <ListItemText primary={`Активные клиенты (${shop?.clients?.length})`} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {shop?.clients?.map(el => <Item key={el?._id ?? el} el={el} />)}
              </List>
            </Collapse>
          </List>
        </DialogContent>
        <DialogActions className={classes.buttonGroup}>
          <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <Button 
              onClick={() => handleShowEdit(true)} 
              className={classes.button}
              variant='contained' 
              color="primary"
            >
              Изменить
            </Button>
            <InsertOrderModal shop={shop} />
          </Box>
          <Box sx={{alignSelf: 'flex-end'}}>
            <Button onClick={handleClose} variant='outlined' color="default">
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  </>);
}
