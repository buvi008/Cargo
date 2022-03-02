const router = require('express').Router();
const UserModal = require('../models/user.model');
const Shop = require('../models/shop.model');
const ShopLog = require('../models/shopLog.model');
const { body, validationResult } = require('express-validator');
const { create_shop, remove_shop } = require('../config/config');
const multer = require('multer');
const path = require('path');
const { generateCode } = require('../helpers/generateCode');

function changeName (originalname) {return String(Date.now()) + Math.floor(Math.random() * (99 - 10) + 10) + path.extname(originalname)}
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null,true);
  } else {
      cb('Error: Недопустимый формат!');
  }
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/static/images/shops')
  },
  filename: (req, file, cb) => {
    const { originalname } = file
    cb(null, changeName(originalname))
  }
})
const upload = multer({ storage: storage,
    limits: {
        fields: 10,
        // fieldNameSize: 50,
        // fieldSize: 20000,
        fileSize: 150000000000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function(_req, file, cb){
        checkFileType(file, cb);
    }
})


router.route('/')
  .get(
    async (req, res) => {
      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      if(req.query.name && create_shop.includes(user.role)) {
        const name = new RegExp(req.query.name);
        const shops = await Shop.find({name}, {__v: false, createdAt: false, updatedAt: false, creator: false, orders_closed: false}).limit(50);
        return res.status(200).json(shops);
      }

      if (create_shop.includes(user.role)) {
        const shops = await Shop.find({}, {__v: false, createdAt: false, updatedAt: false, creator: false, orders_closed: false})
        .populate({
          path    : 'clients',
          populate: [
              { path: 'orders' },
          ]
        });
        return res.status(200).json(shops);
      } else {
        return res.status(403).json({msg: 'No access'})
      }
    }
  )
  .post(
    upload.any(),
    body('name').isLength({ min: 1, max: 100 }),
    body('responsible').isLength({ min: 1, max: 100 }),
    body('phone').isLength({ min: 1, max: 100 }),
    body('city').isLength({ min: 1, max: 100 }),
    body('address').isLength({ min: 1, max: 100 }),
    // body('url').isLength({ min: 1, max: 100 }),
    async (req, res) => { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      if (create_shop.includes(user.role)) {
        const count = await ShopLog.countDocuments();
        await new Shop({
          ...req.body, 
          images: req.files.map(el=> el.filename),
          code: generateCode(count),
          creator: user.login
        }).save((err, data) => {
          if (err) return res.status(500).json({msg: 'refresh'});

          ShopLog.create({
            name: data.name,
            origin_id: data._id,
            phone: data.phone,
            phone2: data.phone2,
            city: data.city,
            address: data.address,
            info: data.info,
            url: data.url,
            images: data.images,
            code: data.code,
            creator: data.creator,
          })

          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'ADD_SHOP',
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
    body('responsible').isLength({ min: 1, max: 100 }),
    body('address').isLength({ min: 1, max: 100 }),
    // body('url').isLength({ min: 1, max: 100 }),
    body('_id').isLength({ min: 1, max: 100 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const user = await UserModal.findOne({accessToken: req.headers.authorization});
      if(!user) return res.status(401).json({msg: 'refresh/ invalid Auth'});

      if (remove_shop.includes(user.role)) {
        try {
          await Shop.updateOne({_id: req.body._id}, 
            {...req.body});
          const edit = await Shop.findById(req.body._id);
          req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
            type: 'EDIT_SHOP',
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

  //     if (remove_shop.includes(user.role)) {
  //       try {
  //         await Shop.deleteOne({_id: req.body._id});
  //         req?.wss?.clients?.forEach(user => user.send(JSON.stringify({
  //           type: 'REMOVE_SHOP',
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
