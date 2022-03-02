import * as ACTION_TYPES from '../action-types';


const orderReducer = (state=[], action) => {
  switch(action.type) {
    case ACTION_TYPES.ADD_NOTI:
      return [...state, action.payload.data];
    default:
      return state;
  }
};

export default orderReducer;
