const { Schema, model } = require('./connectDB');

const airQualitySchema = new Schema({
  latitude: Number,
  longitude: Number,
  aqi: Number,
  lastRetrieved: { type: Date, default: Date.now, expires: '2h' },
});

const AirQuality = model('air-quality', airQualitySchema);

module.exports = {
  AirQuality,
};
