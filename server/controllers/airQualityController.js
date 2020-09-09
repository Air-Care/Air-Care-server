const fetch = require('node-fetch');
const { AirQuality } = require('../models/airQualityModel');

const { BREEZOMETER_API } = process.env;

async function getAirQuality({ latitude, longitude }) {
  try {
    let aqi;
    const [result] = await AirQuality.find({ latitude, longitude });

    if (result !== undefined) {
      aqi = result.aqi;
    } else {
      const response = await fetch(
        `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${latitude}&lon=${longitude}&key=${BREEZOMETER_API}`
      );
      const data = await response.json();
      aqi = data.data.indexes.baqi.aqi;
      AirQuality.create({ latitude, longitude, aqi }).catch((err) =>
        console.error(
          `Error writing AQI to database on request LAT(${latitude}) LON(${longitude}):\n${err}`
        )
      );
    }

    return aqi;
  } catch (err) {
    console.error(
      `Error retrieving AQI data on request LAT(${latitude}) LON(${longitude}):\n${err}`
    );
    return -1;
  }
}

module.exports = {
  getAirQuality,
};
