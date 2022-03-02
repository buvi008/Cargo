import React from 'react';
import TextField from "@material-ui/core/TextField";

export default function Input({props}) {
  const {touched, errors, values, handleBlur, handleChange, key, label} = props

  return (
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
  )
}
