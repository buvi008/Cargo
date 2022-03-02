import * as ACTION_TYPES from '../action-types';


const clientReducer = (state=[], action) => {
  switch(action.type) {
    case ACTION_TYPES.INIT_CLIENTS:
      return action.payload.clients;
    case ACTION_TYPES.ADD_CLIENT:
      return [...state, action.payload.client];
    case ACTION_TYPES.REMOVE_CLIENT:
      return state.filter(el => el._id !== action.payload._id);
    case ACTION_TYPES.EDIT_CLIENT:
      return state.map(el => {
        if (el._id === action.payload.client._id) {
          return action.payload.client;
        }
        return el;
      })
    case ACTION_TYPES.UPDATE_CLIENT:
      return state.map(el => {
        if (el._id === action.payload.order.client_id) {
          return {...el, orders: action.payload.order.orders, 
            active: action.payload.order.active ?? el.active,
            active_count: action.payload.order.active_count ?? el.active_count,
            isClosed: action.payload.order.isClosed ?? el.isClosed,
          }
        };
        return el;
      })
    default:
      return state;
  }
};

export default clientReducer;
