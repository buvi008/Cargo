/* eslint-disable */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Cookies from 'universal-cookie';

const weight = [
  {
    name: '0.5 Kg',
    weight: 0.5
  },
  {
    name: '1.0 Kg',
    weight: 1.0
  },
  {
    name: '1.5 Kg',
    weight: 1.5
  },
  {
    name: '2.0 Kg',
    weight: 2.0
  },
  {
    name: '2.5 Kg',
    weight: 2.5
  },
  {
    name: '3.0 Kg',
    weight: 3.0
  }
]

export default React.memo(function Input({props}) {
  const {values, setFieldValue, handleBlur, handleChange, key, label} = props;
  const [options, setOptions] = React.useState([]);
  console.log(options)
  const [input, setInput] = React.useState('');
  const cookies = new Cookies();

  React.useEffect(() => {
    if (key === 'weight') setOptions(weight)
    if (['client', 'shop'].includes(key) && input) {
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`http://${window.location.hostname}/${key}/?`+new URLSearchParams({name: input}), {
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
        setOptions(json);
      })
      .catch(err => {
        console.log(err);
      })
    }
  }, [input]);

  const handleOptions = (e) => {
    setInput(e.target.value);
  }

  return (
    <Autocomplete
      options={options}
      value={values[key] || null}
      getOptionLabel={(option) => `${option.name} (${option.code ?? option.address ?? option.weight})`}
      onChange={(e, newValue) => setFieldValue(key, newValue)}
      getOptionSelected={(option, value) => option.name === value.name}
      renderInput={(params) => <TextField
        {...params}
        label={label}
        title={values[key]?.info ?? label}
        name={key}
        onChange={(e, newValue) => handleOptions(e, newValue)}
        onBlur={handleBlur}
        variant="outlined"
        margin='normal'
        fullWidth
      />}
    />
  );
}, (prev, next) => prev.props.values[prev.props.key] === next.props.values[next.props.key])
