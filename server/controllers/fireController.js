const fetch = require('node-fetch');
const { Fires } = require('../models/fireModel');

const { BREEZOMETER_API } = process.env;

async function getFires({ latitude, longitude }) {
  try {
    let fires;
    const [result] = await Fires.find({ latitude, longitude });

    if (result !== undefined) {
      fires = result.fires;
    } else {
      const response = await fetch(
        `https://api.breezometer.com/fires/v1/current-conditions?lat=${latitude}&lon=${longitude}&key=${BREEZOMETER_API}&radius=62&unit=imperial`
      );
      const data = await response.json();

      fires = data.data.fires
        .filter(({ confidence }) => confidence === 'High')
        .map(({ update_time, position: { lat, lon } }) => ({
          latitude: lat,
          longitude: lon,
          updateTime: update_time,
        }));
      Fires.create({ latitude, longitude, fires }).catch((err) =>
        console.error(
          `Error writing fires to database on request LAT(${latitude}) LON(${longitude}):\n${err}`
        )
      );
    }

    return fires;
  } catch (err) {
    console.error(
      `Error retrieving fire data on request LAT(${latitude}) LON(${longitude}):\n${err}`
    );
    return [];
  }
}

module.exports = {
  getFires,
};
