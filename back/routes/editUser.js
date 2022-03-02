const express = require('express');
const router = express.Router();
const UserModal = require('../models/user.model')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const createToken = require('../helpers/token');
const loginDestroy = require('../helpers/loginDestroy');

router.route('/signin')
    .post(
      body('login').isLength({ min: 3, max: 50 }),
      body('password').isLength({ min: 3, max: 20 }),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      
        const {login, password} = req.body;

        const user = await UserModal.findOne({ login }).exec();
        if(!user) return res.status(400).json({error: 'Invalid login'});

        const isValidPass = await bcrypt.compare(password, user.password);

        if (isValidPass) {
            const payload = { id: user._id };
            user.accessToken = createToken('access', payload);
            user.refreshToken = createToken('refresh', payload);

            user.save();

            return res.status(200).json(loginDestroy(user));
        }
        return res.status(400).json({error: 'invalid password'});
      }
    )

router.route('/is_me')
    .post(
      async (req, res) => {
        const user = await UserModal.findOne({ accessToken: req.headers.authorization }).exec();
        if(!user) return res.status(401).json({error: 'Invalid Auth'});
        return res.status(200).json(loginDestroy(user));
      }
    )
router.route('/logout')
    .post(
      async (req, res) => {
        const token = req.headers.authorization;
        const user = await UserModal.updateOne({accessToken: token}, {accessToken: '', refreshToken: ''});

        if(user.ok) {
          res.status(200).send(JSON.stringify({ok: true, msg: 'Успешный выход'}));
        } else {
          res.status(400).send(JSON.stringify({ok: false, msg: 'Попробуйте снова'}));
        }
      }
    )


module.exports = router;
