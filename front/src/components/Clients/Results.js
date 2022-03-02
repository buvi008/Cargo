/* eslint-disable */
import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import Client from './Client';
import { useSelector, useDispatch } from 'react-redux';
import * as ACTION_CLIENTS from '../../redux/actions/action-clients';
import Cookies from 'universal-cookie';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));



const Results = ({ className, find, filter, active=false, ...rest }) => {
  const classes = useStyles();
  const [clean, setClean] = React.useState(false);
  const clients = useSelector(state => state.clients);

  const cookies = new Cookies();
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  React.useEffect(() => {
    if (!clean) {
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`http://${window.location.hostname}/client?active=${active}`, {
            method: 'GET',
            headers: {
              Authorization: cookies.get('sid'),
            },
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
        console.log(json)
        dispatch(ACTION_CLIENTS.INIT_CLIENTS(json))
      })
      .catch(err => {
        console.log(err);
      })
    }
    
    return () => {
      setClean(true)
    }
  }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
    <Box m={1} sx={{ minWidth: 1050 }}>
      <PerfectScrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Телефон
                </TableCell>
                <TableCell>
                  ФИО
                </TableCell>
                <TableCell>
                  Город
                </TableCell>
                <TableCell>
                  Адрес
                </TableCell>
                <TableCell>
                  Orders
                </TableCell>
                <TableCell>
                  Код
                </TableCell>
                <TableCell>
                  Создано
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.filter(el=>el[filter]?.toLowerCase().includes(find.trim().toLowerCase())).slice(limit*page, (page*limit)+limit).map((el) => (
                <Client key={el._id} client={el}/>
              ))}
            </TableBody>
          </Table>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={clients.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        labelDisplayedRows={({ from, to, count }) =>`${from}-${to} из ${count !== -1 ? count :`more than ${to}`}`}
        labelRowsPerPage={'Кол-во'}
        rowsPerPageOptions={[5, 10, 25]}
      />
      </Box>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default React.memo(Results);
