const { get } = require("axios").default;

const cityCode = "3433955"; // CABA
const apiId = process.env.WEATHER_API_ID;
const unit = "metric";
const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${apiId}&units=${unit}`;

/**
 *
 * @param {String} description
 * @param {DoubleRange} temperature
 * @param {String} icon
 * @param {DoubleRange} humidity
 * @param {String} feelsLike
 */
function Clima(description, temperature, icon, humidity, feelsLike) {
  this.description = description;
  this.temperature = temperature;
  this.icon = icon;
  this.humidity = humidity;
  this.feelsLike = feelsLike;
}

Clima.prototype.toString = function stringifyWeather() {
  return `
    > *Descripcion*: ${this.description},
    > *Temperatura*: ${this.temperature}°C,
    > *Térmica*: ${this.feelsLike}°C,
    > *Humedad*: ${this.humidity} %`;
};

/**
 * TODO: Recibir la localidad? O el timeframe ('en los proximos 5 dias')?
 * @throws {String}
 * @returns {Clima} El objeto clima
 */
async function getCurrentWeather() {
  try {
    const {
      data: { main, weather },
    } = await get(url);
    console.log(main, weather);
    const weatherInfo = await new Clima(
      weather[0].description,
      main.temp,
      weather[0].icon,
      main.humidity,
      main.feels_like
    );
    return weatherInfo;
  } catch (e) {
    // TODO: Mejorar esto!
    console.error(JSON.stringify(e));
    return `No pudimos traer nada :'v`;
  }
}

module.exports = { getCurrentWeather };
