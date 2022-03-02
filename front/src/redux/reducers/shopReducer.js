import * as ACTION_TYPES from '../action-types';


const shopReducer = (state=[], action) => {
  console.log(action)
  switch(action.type) {
    case ACTION_TYPES.INIT_SHOPS:
      return action.payload.shops;
    case ACTION_TYPES.ADD_SHOP:
      return [...state, action.payload.shop];
    // case ACTION_TYPES.REMOVE_SHOP:
    //   return state.filter(el => el._id !== action.payload._id);
    case ACTION_TYPES.EDIT_SHOP:
      return state.map(el => {
        if (el._id === action.payload.shop._id) {
          return action.payload.shop;
        }
        return el;
      })
    case ACTION_TYPES.UPDATE_SHOP:
      return state.map(el => {
        if (el._id === action?.payload?.order?.shop_id) {
          return {...el, clients: action?.payload?.order?.clients ?? el.clients}
        };
        return el;
      })
    default:
      return state;
  }
};

export default shopReducer;
