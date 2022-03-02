const { code_length, region_code } = require('../config/config');

function generateCode(value) {
  // if (typeof value === 'number' && typeof count === 'number') throw new Error({})
  if (value.toString().length >= code_length) return value.toString();
  return generateCode('0'+value);
}

function createOrderCode(client, shop) {
  return `${region_code}-${client?.code}-${shop?.code}`;
}

module.exports = {
  generateCode,
  createOrderCode,
}
