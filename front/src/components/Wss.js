import React from 'react';
import { useDispatch } from 'react-redux';
import * as ACTION_TYPES from '../redux/action-types';
import * as ACTION_CLIENT from '../redux/actions/action-clients';
import * as ACTION_SHOP from '../redux/actions/action-shops';
import * as ACTION_ORDER from '../redux/actions/action-orders';


function Wss() {
  const dispatch = useDispatch();
  let interval, socket;

  async function connect() {
    clearInterval(interval);
    socket = await new WebSocket(`ws://${window.location.hostname}`);

    socket.onopen = onopen;
    socket.onmessage = onmessage;
    socket.onclose = onclose;
    socket.onerror = onerror;

    interval = setInterval(function () {
      if (!socket.readyState) {
        connect();
      }
    }, 10*1000)
  }

  connect();

  function onopen (event) {
    console.log("[open] Соединение установлено");
  };
  
  function onmessage (event) {
    console.log(event)
    const {type, payload} = JSON.parse(event.data);
    console.log(type, payload)
    switch (type) {
      case ACTION_TYPES.ADD_CLIENT:
        dispatch(ACTION_CLIENT.ADD_CLIENT(payload.data));
        break;
      // case ACTION_TYPES.REMOVE_CLIENT:
      //   dispatch(ACTION_CLIENT.REMOVE_CLIENT(payload.data));
      //   break;
      case ACTION_TYPES.EDIT_CLIENT:
        dispatch(ACTION_CLIENT.EDIT_CLIENT(payload.data));
        break;
      case ACTION_TYPES.ADD_SHOP:
        dispatch(ACTION_SHOP.ADD_SHOP(payload.data));
        break;
      // case ACTION_TYPES.REMOVE_SHOP:
      //   dispatch(ACTION_SHOP.REMOVE_SHOP(payload.data));
      //   break;
      case ACTION_TYPES.EDIT_SHOP:
        dispatch(ACTION_SHOP.EDIT_SHOP(payload.data));
        break;
      case ACTION_TYPES.ADD_ORDER:
        dispatch(ACTION_ORDER.ADD_ORDER(payload.data));
        dispatch(ACTION_CLIENT.UPDATE_CLIENT(payload));
        dispatch(ACTION_SHOP.UPDATE_SHOP(payload));
        break;
      case ACTION_TYPES.REMOVE_ORDER:
        dispatch(ACTION_ORDER.REMOVE_ORDER(payload.data));
        dispatch(ACTION_CLIENT.UPDATE_CLIENT(payload));
        dispatch(ACTION_SHOP.UPDATE_SHOP(payload));
        dispatch({type: 'ADD_NOTI', payload: {data: `${payload.code} был удален`}});
        // if (!payload.active) dispatch(ACTION_CLIENT.REMOVE_CLIENT(payload.client_id));
        break;
      case ACTION_TYPES.UPDATE_ORDER:
        dispatch(ACTION_ORDER.UPDATE_ORDER(payload.data));
        dispatch(ACTION_CLIENT.UPDATE_CLIENT(payload));
        dispatch(ACTION_SHOP.UPDATE_SHOP(payload));
        break;
      default:
        break;
    }

  };
  
  function onclose (event) {
    if (event.wasClean) {
      console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
      console.log('[close] Соединение прервано');
      connect();
    }
  };
  
  function onerror (error) {
    console.log(`[error] ${error}`);
  };

  return (
    <></>
  )

}


export default Wss;
