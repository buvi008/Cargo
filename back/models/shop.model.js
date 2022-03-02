const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    name: {type: String, require: true},
    responsible: {type: String, require: true},
    phone: {type: String, require: true},
    phone2: {type: String, default: ''},
    address: {type: String, require: true},
    images: {type: Array, default: []},
    url: {type: String, require: true},
    creator: {type: String, require: true},
    info: {type: String, default: ''},
    clients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Client'}],
    code: {type: String, require: true, unique: true},
}, {timestamps: true})

module.exports = mongoose.model('Shop', shopSchema);
