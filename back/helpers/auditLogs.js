const UserModal = require('../models/user.model');
const AuditModal = require('../models/audit.model');
// JSON body saves;
async function auditLogs(req, res, next) {
  if (Object.keys(req.body).length === 0) return next();
  const user = await UserModal.findOne({accessToken: req.headers.authorization}) ?? {};
  AuditModal.create({
    name: user.name,
    login: user._id,
    json: req.body,
  });
  return next();
}

module.exports = auditLogs;
