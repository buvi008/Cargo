const express = require('express');
const router = express.Router();
const UserModal = require('../models/user.model');
const Client = require('../models/client.model');
const ClientLog = require('../models/clienLog.model');
const { body, validationResult } = require('express-validator');
const { generateCode } = require('../helpers/generateCode');
const { create_client, remove_client, show_active_client } = require('../config/config');

router.route('/')
  .get(
    async (req, res) => {
      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});
      
      if(req.query.name && create_client.includes(user.role)) {
        const name = new RegExp(req.query.name);
        const clients = await Client.find({name}, {__v: false, createdAt: false, updatedAt: false, creator: false, orders_closed: false}).limit(50);
        return res.status(200).json(clients);
      }
      
      const active = req.query.active === 'true' ? true : false;
      if (create_client.includes(user.role) && !active) {
        const clients = await Client.find({}, {__v: false, updatedAt: false, orders_closed: false})
        .populate('orders');
        return res.status(200).json(clients);
      } if (show_active_client.includes(user.role)) {
        const clients = await Client.find({active: true}, {__v: false, updatedAt: false, orders_closed: false})
        .populate('orders');
        return res.status(200).json(clients);
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  .post(
    body('name').isLength({ min: 1, max: 100 }),
    body('phone').isLength({ min: 1, max: 100 }),
    body('city').isLength({ min: 1, max: 100 }),
    body('address').isLength({ min: 1, max: 100 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      if (create_client.includes(user.role)) {
        const count = await ClientLog.countDocuments();
        await new Client({
          ...req.body, 
          code: generateCode(count), 
          creator: user.login
        }).save((err, data) => {
          if (err) return res.status(500).json({msg: 'refresh'});

          ClientLog.create({
            name: data.name,
            origin_id: data._id,
            phone: data.phone,
            city: data.city,
            address: data.address,
            info: data.info,
            code: data.code,
            creator: data.creator,
            orders: data.orders,
          })
          
          // SENDING SUCCESS RESULT
          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'ADD_CLIENT',
            payload: {
              data,
            }
          })));
          return res.status(200).json(data)
        });
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  .put(
    body('name').isLength({ min: 1, max: 100 }),
    body('phone').isLength({ min: 1, max: 100 }),
    body('city').isLength({ min: 1, max: 100 }),
    body('address').isLength({ min: 1, max: 100 }),
    body('_id').isLength({min: 1, max: 100}),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      if (remove_client.includes(user.role)) {
        try {
          await Client.updateOne({_id: req.body._id}, {...req.body});
          const edit = await Client.findById(req.body._id);
          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'EDIT_CLIENT',
            payload: {
              data: edit,
            }
          })));
          return res.status(200).json(edit);
        } catch (error) {
          return res.status(500).json({msg: 'refresh', error})
        }
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  // .delete(
  //   body('_id').isLength({min: 1, max: 50}),
  //   async (req, res) => {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //         return res.status(400).json({ errors: errors.array() });
  //     }

  //     const user = await UserModal.findOne({accessToken: req.headers.authorization});
  //     if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

  //     if (remove_client.includes(user.role)) {
  //       try {
  //         await Client.deleteOne({_id: req.body._id});
  //         // SENDING SUCCESS RESULT
  //         req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
  //           type: 'REMOVE_CLIENT',
  //           payload: {
  //             data: req.body._id,
  //           }
  //         })));
  //         return res.sendStatus(200);
  //       } catch (error) {
  //         return res.status(500).json({msg: 'refresh', error});
  //       }
  //     } else {
  //       return res.status(403).json({msg: 'No access'})
  //     }
  //   }
  // )


module.exports = router;
