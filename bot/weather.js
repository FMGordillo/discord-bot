const axios = require("axios");

const cityCode = "3433955"; //CABA
const apiId = process.env.WEATHER_API_ID;
const unit = "metric";
let url = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${apiId}&units=${unit}`;

function Clima(descr,temp,hum,termica){
  this.description= descr;
  this.temperature= temp;
  this.humidity= hum;
  this.feelsLike= termica;
}
//response.data.main.temp
async function getTemperature() {
  try {
    const response = await axios.get(url);
    const weatherInfo = await new Clima(response.data.weather[0].description,
                                        response.data.main.temp,
                                        response.data.main.humidity,
                                        response.data.main.feels_like);
    return weatherInfo;
  } catch (e) {
    console.error(JSON.stringify(e));
  }
}

module.exports = { getTemperature };
