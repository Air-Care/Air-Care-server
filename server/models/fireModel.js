const { Schema, model } = require('./connectDB');

const fireSchema = new Schema({
  latitude: Number,
  longitude: Number,
  fires: [{ latitude: Number, longitude: Number, update_time: String }],
  lastRetrieved: { type: Date, default: Date.now, expires: '18h' },
});

const Fires = model('fire', fireSchema);

module.exports = {
  Fires,
};
