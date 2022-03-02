import * as ACTION_TYPES from '../action-types';


const orderReducer = (state=[], action) => {
  switch(action.type) {
    case ACTION_TYPES.INIT_ORDERS:
      return action.payload.orders;
    case ACTION_TYPES.ADD_ORDER:
      return [...state, action.payload.order];
    case ACTION_TYPES.REMOVE_ORDER:
      return state.filter(el => el._id !== action.payload._id);
    case ACTION_TYPES.UPDATE_ORDER:
      return state.map(el => {
        if (el._id === action.payload.order._id) return action.payload.order;
        return el;
      })
    default:
      return state;
  }
};

export default orderReducer;
