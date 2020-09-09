const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(`Error connecting to MongoDB:\n${err}`));

const { Schema, model } = mongoose;

module.exports = { Schema, model };
