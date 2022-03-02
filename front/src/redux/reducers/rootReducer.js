import { combineReducers } from 'redux';
import userReducer from './userReducer';
import clientReducer from './clientReducer';
import shopReducer from './shopReducer';
import orderReducer from './orderReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
  online: userReducer,
  clients: clientReducer,
  shops: shopReducer,
  orders: orderReducer,
  notifications: notificationReducer,
})


export default rootReducer;
