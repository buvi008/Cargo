import * as ACTION_TYPES from "../action-types";

const INIT_SHOPS = (shops) => {
  return {
    type: ACTION_TYPES.INIT_SHOPS,
    payload: {
      shops,
    }
  }
};

const ADD_SHOP = (shop) => {
  return {
    type: ACTION_TYPES.ADD_SHOP,
    payload: {
      shop,
    }
  }
}

const REMOVE_SHOP = (_id) => {
  return {
    type: ACTION_TYPES.REMOVE_SHOP,
    payload: {
      _id,
    }
  }
}

const EDIT_SHOP = (shop) => {
  return {
    type: ACTION_TYPES.EDIT_SHOP,
    payload: {
      shop,
    }
  }
}

const UPDATE_SHOP = (order) => {
  return {
    type: ACTION_TYPES.UPDATE_SHOP,
    payload: {
      order,
    }
  }
}

export {
  INIT_SHOPS,
  ADD_SHOP,
  REMOVE_SHOP,
  EDIT_SHOP,
  UPDATE_SHOP,
} 
