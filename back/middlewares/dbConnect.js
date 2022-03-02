const mongoose = require('mongoose');


module.exports = function dbConnect() {
  mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
  console.log('DB Connect', process.env.DB_NAME);
}
