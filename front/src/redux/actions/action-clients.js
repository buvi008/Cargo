import * as ACTION_TYPES from "../action-types";

const INIT_CLIENTS = (clients) => {
  return {
    type: ACTION_TYPES.INIT_CLIENTS,
    payload: {
      clients,
    }
  }
};

const ADD_CLIENT = (client) => {
  return {
    type: ACTION_TYPES.ADD_CLIENT,
    payload: {
      client,
    }
  }
}

const REMOVE_CLIENT = (_id) => {
  return {
    type: ACTION_TYPES.REMOVE_CLIENT,
    payload: {
      _id,
    }
  }
}

const EDIT_CLIENT = (client) => {
  return {
    type: ACTION_TYPES.EDIT_CLIENT,
    payload: {
      client,
    }
  }
}

const UPDATE_CLIENT = (order) => {
  return {
    type: ACTION_TYPES.UPDATE_CLIENT,
    payload: {
      order,
    }
  }
}

export {
  INIT_CLIENTS,
  ADD_CLIENT,
  REMOVE_CLIENT,
  EDIT_CLIENT,
  UPDATE_CLIENT,
} 
