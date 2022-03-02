const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    title: {type: String, require: true, default: 'title'},
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', require: true},
    shop: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop', require: true},
    weight: {type: Number, require: true},
    unit: {type: String, default: '0+ Kg'},
    isClosed: {type: Boolean, require: true, default: false},
    code: {type: String, require: true},
    status: {type: Number, default: 0}
}, {timestamps: true})

module.exports = mongoose.model('Order', orderSchema);


// Новый заказ
// На складе в Труции
// На складе в МСК
// Готов к выдаче (город)
// Выдан
