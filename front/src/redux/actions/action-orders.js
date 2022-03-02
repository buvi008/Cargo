import * as ACTION_TYPES from "../action-types";

const INIT_ORDERS = (orders) => {
  return {
    type: ACTION_TYPES.INIT_ORDERS,
    payload: {
      orders,
    }
  }
};

const ADD_ORDER = (order) => {
  return {
    type: ACTION_TYPES.ADD_ORDER,
    payload: {
      order,
    }
  }
}

const REMOVE_ORDER = (_id) => {
  return {
    type: ACTION_TYPES.REMOVE_ORDER,
    payload: {
      _id,
    }
  }
}

const UPDATE_ORDER = (order) => {
  return {
    type: ACTION_TYPES.UPDATE_ORDER,
    payload: {
      order,
    }
  }
}

export {
  INIT_ORDERS,
  ADD_ORDER,
  REMOVE_ORDER,
  UPDATE_ORDER,
} 
