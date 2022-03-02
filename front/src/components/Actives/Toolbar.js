/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  addButton: {
    marginRight: theme.spacing(1)
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

const filters = ['phone', 'name', 'city', 'address', 'code'];

const Toolbar = ({ className, filter, find, handleFindInput, handleFilter, ...rest }) => {
  const classes = useStyles();

  return (
    <>
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.exportButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box sx={{display: 'flex'}}>
              <TextField
                fullWidth
                onChange={handleFindInput}
                value={find}
                size={'small'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <FormControl>
                        <Select
                          value={filter}
                          onChange={handleFilter}
                          className={classes.formControl}
                          displayEmpty
                        >
                          {filters.map(el => <MenuItem key={el} value={el}>{el}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  )
                }}
                placeholder="Поиск клиентов"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  </>);
};

Toolbar.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.string,
  find: PropTypes.string,
};

export default React.memo(Toolbar, (prev, next) => {
  if (prev.find === next.find) return false;
  if (prev.filter === next.filter) return false;
  return true;
});
