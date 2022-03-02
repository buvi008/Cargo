import * as ACTION_TYPES from "../action-types";

const CHANGE_ONLINE = (bool) => {
  return {
    type: ACTION_TYPES.CHANGE_ONLINE,
    payload: {
      bool
    }
  }
};

export {
  CHANGE_ONLINE,
} 
