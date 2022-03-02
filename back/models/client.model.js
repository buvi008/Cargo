const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {type: String, require: true},
    phone: {type: String, require: true},
    city: {type: String, require: true},
    address: {type: String, require: true},
    info: {type: String, default: ''},
    code: {type: String, require: true, unique: true},
    active: {type: Boolean, default: false},
    active_count: {type: Number, default: 0},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    orders_closed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
    creator: {type: String, require: true},
}, {timestamps: true})

module.exports = mongoose.model('Client', clientSchema);
