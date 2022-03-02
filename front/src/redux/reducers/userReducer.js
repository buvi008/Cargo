import * as ACTION_TYPES from '../action-types';


const userReducer = (state=false, action) => {
  switch(action.type) {
    case ACTION_TYPES.CHANGE_ONLINE:
      return action.payload.bool
    default:
      return state;
  }
};

export default userReducer;
