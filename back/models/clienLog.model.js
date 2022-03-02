const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {type: String, require: true},
    origin_id: {type: mongoose.Schema.Types.ObjectId},
    phone: {type: String, require: true},
    city: {type: String, require: true},
    address: {type: String, require: true},
    info: {type: String, default: ''},
    code: {type: String, require: true},
    creator: {type: String, require: true},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    orders_closed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
}, {timestamps: true})

module.exports = mongoose.model('ClientLog', clientSchema);
