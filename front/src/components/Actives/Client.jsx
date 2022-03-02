import React from 'react';
import { 
  TableRow,
  TableCell,
  Typography,
  Box,
} from '@material-ui/core';
import Modal from './Details/Modal';

export default React.memo(function Client({client={}}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (<>
      {open && <TableRow style={{display: 'none'}} ><TableCell><Modal client={client} handleClose={handleClose} /></TableCell></TableRow>}
      <TableRow
        hover
        title={client.info || 'Нет дополнительной информации'}
        onClick={handleClickOpen}
        style={{cursor: 'pointer'}}
      >
        <TableCell>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Typography
              color="textPrimary"
              variant="body1"
            >
              {client?.phone}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          {client?.name}
        </TableCell>
        <TableCell>
          {client?.city}
        </TableCell>
        <TableCell>
          {client?.address}
        </TableCell>
        <TableCell>
          {client?.orders?.filter(e=>e.status === 4)?.length} / {client?.orders?.length}
        </TableCell>
        <TableCell>
          <Typography style={{background: 'rgb(255,0,0, 0.7)'}} variant={'inherit'} color="textSecondary">
            {client?.code}
          </Typography>
        </TableCell>
        <TableCell>
          {window.formatDate(client?.createdAt)}
        </TableCell>
      </TableRow>
    </>
  );
});
// , (prev, next) => {
//   if(prev.checked !== next.checked) return false;
//   if(JSON.stringify(prev.client) !== JSON.stringify(next.client)) return false;
//   return true;
// }
