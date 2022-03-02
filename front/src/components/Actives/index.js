/* eslint-disable */
import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import Results from '../Clients/Results';
import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ClientsView = () => {
  const classes = useStyles();
  const [find, setFind] = React.useState('');
  const [filter, setFilter] = React.useState('phone')

  const handleFindInput = (e) => {
    setFind(e.target.value);
  }

  const handleFilter = (e) => {
    setFilter(e.target.value);
  }

  return (
    <Page
      className={classes.root}
      title="Клиенты"
    >
      <Container maxWidth={false}>
        <Toolbar 
          filter={filter} 
          find={find} 
          handleFindInput={handleFindInput}
          handleFilter={handleFilter}
        />
        <Box mt={3}>
          <Results filter={filter} find={find} active={true} />
        </Box>
      </Container>
    </Page>
  );
};

export default ClientsView;
