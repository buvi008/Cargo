// 1 - Admin
// 2 - Manager
// 3 - Auditor

const create_client = [1,2];
const remove_client = [1,2];
const show_active_client = [1,2,3];

const code_length = 3;
const region_code = '777';

const create_shop = [1,2];
const remove_shop = [1,2];

const create_order = [1,2];
const remove_order = [1,2];
const show_order = [1,2,3];


module.exports = {
  create_client,
  code_length,
  remove_client,
  create_shop,
  remove_shop,
  create_order,
  remove_order,
  show_order,
  show_active_client,
  region_code,
}
