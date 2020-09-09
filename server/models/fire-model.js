const { Schema, model } = require('./connect-db');

const fireSchema = new Schema({
  latitude: String,
  longitude: String,
  fires: [{ latitude: String, longitude: String }],
  lastRetrieved: { type: Date, default: Date.now, expires: '18h' },
});

const fire = model('fire', fireSchema);

module.exports = {
  fire,
};
