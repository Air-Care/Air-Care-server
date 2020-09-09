const { Schema, model } = require('./connect-db');

const airQualitySchema = new Schema({
  latitude: String,
  longitude: String,
  aqi: Number,
  lastRetrieved: { type: Date, default: Date.now, expires: '2h' },
});

const airQuality = model('air-quality', airQualitySchema);

module.exports = {
  airQuality,
};
