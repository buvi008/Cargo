import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as ACTION_SHOPS from '../../redux/actions/action-shops';
import Cookies from 'universal-cookie';
import Modal from './Details/Modal';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  caption: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}))


function Shop({shop={}}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (bool) => {
    setOpen(bool);
  };

  return (<>
    <Box onClick={() => handleClickOpen(true)} sx={{cursor: 'pointer'}}>
      <img 
        height={180} width={'100%'} 
        title={shop?.info || 'Нет дополнительной информации'} 
        alt={`Shop - ${shop?.name}`} 
        src={shop?.images[0] ? `./static/images/shops/${shop?.images[0]}` : './static/images/shopnone.png'}
      />
    </Box>
    <Box pr={2} className={classes.root}>
      <Typography gutterBottom variant="body2">
        {shop?.name}
      </Typography>
      <Box className={classes.caption}>
        <Box>
          <Typography display="block" variant="caption" color="textSecondary">
            {shop?.phone}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {`${shop?.responsible} • ${shop?.address}`}
          </Typography>
        </Box>
        <Box sx={{alignSelf: 'flex-end', background: 'rgb(255,0,0, 0.7)', borderRadius: '3px'}}>
          <Typography variant="caption" color="textSecondary">
            {shop?.code}
          </Typography>
      </Box>
    </Box>
  </Box>
  {open && <Modal shop={shop} handleClose={() => handleClickOpen(false)} />}
  </>)
}

function Media(props) {
  const { loading = false, shops = [] } = props;
  
  return (
    <Grid container spacing={1} wrap="wrap">
      {!loading && shops.map((item, index) => (
        <Grid key={index} item xs={12} sm={4} md={3} lg={3} xl={2}>
          {item ? (
            <Shop shop={item} />
            ) : (<>
            <Skeleton variant="rect" height={118} />
              <Box pt={0.5}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </>)}
        </Grid>
      ))}
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function ShopList({filter, find}) {
  const [clean, setClean] = React.useState(false);
  const shops = useSelector(state => state.shops);

  const cookies = React.useMemo(() => new Cookies(), []);
  const dispatch = useDispatch();

  console.log('SHOPLIST')

  React.useEffect(() => {
    if (!clean) {
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`http://${window.location.hostname}/shop`, {
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
        dispatch(ACTION_SHOPS.INIT_SHOPS(json))
      })
      .catch(err => {
        console.log(err);
      })
    }
    
    return () => {
      setClean(true)
    }
  }, [clean, cookies, dispatch])



  return (
    <Box overflow="hidden">
      <Media shops={shops.filter(el=>el[filter].toLowerCase().includes(find.trim().toLowerCase()))} />
    </Box>
  );
}
