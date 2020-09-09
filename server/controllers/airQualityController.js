const axios = require('axios');
const { AirQuality } = require('../models/airQualityModel');

const { BREEZOMETER_API } = process.env;

async function getAirQuality({ latitude, longitude }) {
  try {
    let aqi;
    const [result] = await AirQuality.find({ latitude, longitude });

    if (result !== undefined) {
      aqi = result.aqi;
    } else {
      const { data } = await axios.get(
        `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${latitude}&lon=${longitude}&key=${BREEZOMETER_API}`
      );
      aqi = data.data.indexes.aqi;
      AirQuality.create({ latitude, longitude, aqi }).catch((err) =>
        console.error(`ERROR writing AirQuality to DB: ${err}`)
      );
    }

    return aqi;
  } catch (err) {
    console.error(`ERROR getting air quality data: ${err}`);
    return -1;
  }
}

module.exports = {
  getAirQuality,
};
