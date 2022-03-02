const express = require('express');
const router = express.Router();
const UserModal = require('../models/user.model');
const Order = require('../models/order.model');
const { body, validationResult } = require('express-validator');
const { create_order, remove_order, show_order } = require('../config/config');
const Client = require('../models/client.model');
const Shop = require('../models/shop.model');
const { createOrderCode } = require('../helpers/generateCode');

router.route('/')
  .get(
    async (req, res) => {
      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      
      if (show_order.includes(user.role)) {
        const orders = await Order.find({}, {__v: false, creator: false})
          .populate('client', {__v: false, createdAt: false, updatedAt: false})
          .populate('shop', {__v: false, createdAt: false, updatedAt: false});

        return res.status(200).json(orders);
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
    )
  .post(
    body('client').isObject(),
    body('shop').isObject(),
    body('weight').isObject(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      const client = await Client.findOne({_id: req?.body?.client?._id}, {__v: false, createdAt: false, updatedAt: false})
      .populate('orders', {__v: false, updatedAt: false});
      if(!client) return res.status(500).json({msg: 'refresh'});
      
      const shop = await Shop.findOne({_id: req?.body?.shop?._id}, {__v: false, createdAt: false, updatedAt: false})
      .populate({
        path    : 'clients',
        populate: [
            { path: 'orders' },
        ]
      });
      if(!shop) return res.status(500).json({msg: 'refresh'});

      if (create_order.includes(user.role)) {
        await new Order({
          client: client._id, 
          shop: req?.body?.shop?._id,
          unit: req?.body?.weight?.name, 
          weight: +req?.body?.weight?.weight,
          title: req?.body?.client?.city,
          code: createOrderCode(client, shop),
          creator: user.login
        }).save((err, data) => {
            if (err) return res.status(500).json({msg: 'refresh', err});
            let clients = shop?.clients?.map(e=>e);
            client?.orders.push(data._id);
            client.active = true;
            client.save();
            client.orders = client?.orders?.map(e=> {
              if (e._id === data._id) return data;
              return e;
            });
            if (!Boolean(shop?.clients?.some(el => el._id.equals(client._id)))) {
              shop?.clients.push(client._id);
              clients.push(client);
              shop.save();
            } else {
              clients = clients.map(e => e._id.equals(client._id) ? client : e);
            }
            const payload = {
              data: {
                title: data.title, 
                weight: data.weight, 
                unit: data.unit, 
                _id: data._id, 
                isClosed: data.isClosed, 
                status: data.status, 
                code: data.code,
                createdAt: data.createdAt,
                shop, 
                client
              },
              orders: client.orders,
              clients,
              client_id: client._id,
              shop_id: shop._id,
            }
            req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
              type: 'ADD_ORDER',
              payload
            })));
            return res.status(200).json({...payload})
        });
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  .delete(
    body('_id').isLength({min: 1, max: 50}),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});
      const order = await Order.findById(req.body._id);
      
      if (remove_order.includes(user.role)) {
        try {
          await Order.deleteOne({_id: req.body._id});

          const client = await Client.findOne(order?.client, {__v: false, createdAt: false, updatedAt: false})
          .populate('orders', {__v: false, updatedAt: false});
          const shop = await Shop.findById(order?.shop, {__v: false, createdAt: false, updatedAt: false})
          .populate({
            path    : 'clients',
            populate: [
                { path: 'orders' },
            ]
          });
          
          // shop upd. // if do not orders in shop.
          client.active_count = client.orders.filter(e=>e.status === 4).length;
          if (!Boolean(client?.orders?.some(el => el.shop.equals(shop._id)))) {
            client.active = false;
            shop.clients = shop.clients.filter(el => !el._id.equals(client._id));
            shop.save();
          }
          client.save();

          shop.clients = shop.clients.map(e=>{
            if (e._id.equals(client._id)) {
              e.active_count = client.active_count;
            }
            return e;
          })

          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'REMOVE_ORDER',
            payload: {
              code: order.code,
              data: order._id,
              orders: client.orders,
              active: client.active,
              active_count: client.active_count,
              clients: shop.clients,
              client_id: client._id,
              shop_id: shop._id,
            }
          })));
          return res.sendStatus(200);
        } catch (error) {
          return res.status(500).json({msg: 'refresh', error});
        }
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  .put(
    body('order').isObject(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!(req.body.status || req.body.close)) return res.status(400).json({ errors: 'No parameters'});
      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});
      const order = await Order.findById(req.body.order._id, {__v: false, updatedAt: false})
        .populate({path: 'client', populate: [{path: 'orders'}]})
        .populate({path: 'shop', populate: [{path: 'clients'}]})
        
        if (remove_order.includes(user.role)) {
        try {
          order.status = req.body.status ? +req.body.status : order.status;
          order.isClosed = req.body.close ? Boolean(req.body.close) : order.isClosed;
          order.save();
          const client = await Client.findById(order.client._id).populate('orders');
          if (order.isClosed) {
            client.orders = client.orders.filter(e=>!e.equals(order._id));
            client.orders_closed.push(order._id);
            if (!Boolean(client.orders.length)) client.active = false;
          }
          client.active_count = client.orders.filter(e=>e.status === 4)?.length;
          client.save();
          const orders = client.orders.map(e => {
            if (e._id.equals(order._id)) {
              e.status = order.status;
              e.isClosed = order.isClosed;
            }
             return e;
          });
          const clients = order.shop.clients.map(e => {
            if (e._id.equals(client._id)) {
              order.client.orders = orders;
              order.client.active_count = client.active_count;
              return order.client;
            }
            return e;
          })
          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'UPDATE_ORDER',
            payload: {
              data: order,
              orders: orders,
              clients: clients,
              active_count: client.active_count,
              isClosed: order.isClosed,
              client_id: order.client._id,
              shop_id: order.shop._id,
            }
          })));
          return res.status(200).json(order);
        } catch (error) {
          return res.status(500).json({msg: 'refresh', error: error.message})
        }
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )


module.exports = router;
