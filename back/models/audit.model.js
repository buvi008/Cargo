const mongoose = require('mongoose');

const auditSchema = mongoose.Schema({
  name: {type: String, default: 'none'},
  login: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  json: {type: Object, default: {}},
}, {timestamps: true})

module.exports = mongoose.model('Audit', auditSchema);
