const mongoose = require('./connectDB');

const { Schema, model } = mongoose;

const fireSchema = new Schema({
  latitude: Number,
  longitude: Number,
  fires: [{ latitude: Number, longitude: Number }],
  lastRetrieved: { type: Date, default: Date.now, expires: '18h' },
});

const fire = model('fire', fireSchema);

module.exports = {
  fire,
};
