import React from 'react';
import { 
  TableRow,
  TableCell,
  Typography,
  Box,
} from '@material-ui/core';
import Modal from './Details/Modal';

export default React.memo(function Order({order={}}) {
  console.log('ORDER')
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (<>
    {open && <TableRow style={{display: 'none'}} ><TableCell><Modal order={order} handleClose={handleClose} /></TableCell></TableRow>}
    <TableRow
      hover
      title={order.info || 'Нет дополнительной информации'}
      onClick={handleClickOpen}
      style={{cursor: 'pointer'}}
    >
      <TableCell>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Typography
            color="textPrimary"
            variant="body1"
            style={{background: 'rgba(255, 0, 0, 0.2)',}}
          >
            {order?.code}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {order?.unit}
      </TableCell>
      <TableCell>
        {window.formatStatus(order?.status, order?.title)}
      </TableCell>
      <TableCell>
        {order?.isClosed ? 'ЗАКРЫТ' : 'ОТКРЫТ'}
      </TableCell>
      <TableCell>
        {window.formatDate(order?.createdAt)}
      </TableCell>
      <TableCell>
        {window.formatDate(order?.updatedAt)}
      </TableCell>
    </TableRow>
  </>
  );
});
