import React from 'react';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';

export default React.memo(function Input({props}) {
  const {touched, errors, values, handleBlur, handleChange, key, label} = props;

  return (
    <Grid item xs={12} sm={6} md={6}>
      <TextField
        error={Boolean(touched[key] && errors[key])}
        fullWidth
        helperText={touched[key] && errors[key]}
        label={label}
        margin="normal"
        name={key}
        onBlur={handleBlur}
        onChange={handleChange}
        value={values[key]}
        variant="outlined"
        autoComplete={'off'}
      />
    </Grid>
  )
})
