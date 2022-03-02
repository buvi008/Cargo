import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/styles/makeStyles';
import Cookies from 'universal-cookie';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'rgb(63 81 181 / 25%)',
    padding: '0 8px', 
  },
  formControl: {
    "&:before": {
      borderBottom: 0,
    },
    "&:after": {
      borderBottom: 0,
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: 0,
    },
  },
}));

export default function SelectStatus({order={}}) {
  const classes = useStyles();
  const cookies = new Cookies();
  const values = [0,1,2,3,4]
  const [value, setValue] = React.useState(+order.status);
  const [load, setLoad] = React.useState(false);

  const handleChange = (event) => {
    const select = +event.target.value;
    if (!Boolean(values.includes(+select)) || select === +order.status) return;
      setLoad(true);
      if (!load && !order.isClosed) {
        new Promise(async (resolve, reject) => {
          try {
            const res = await fetch(`http://${window.location.hostname}/order`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: cookies.get('sid'),
              },
              body: JSON.stringify({status: select, order})
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
          setValue(select);
          setLoad(false);
        })
        .catch(err => {
          console.log(err);
          setLoad(false);
        })
      }
  };

  return (<>{!load ?
    <div className={classes.root}>
      <FormControl>
        <Select
          value={value}
          disabled={order.isClosed}
          onChange={handleChange}
          className={classes.formControl}
          displayEmpty
        >
          {values.map(el => <MenuItem key={el} value={el}>{window.formatStatus(el, order.title)}</MenuItem>)}
        </Select>
      </FormControl>
    </div> :
    <Skeleton width={160} height={32} animation="wave" />}
  </>);
}
