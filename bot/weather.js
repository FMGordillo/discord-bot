const axios = require('axios')

const cityCode='3433955'; //CABA
const apiId=process.env.WEATHER_API_ID; //me da undefined ndea porque
const unit='metric'
let url=`https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${apiId}&units=${unit}`


async function getTemperature(){
    try{
        const response = await axios.get(url);
        const temperature = await response.data.main.temp;
        return temperature;
    }catch(e){
        console.error(JSON.stringify(e));
    }
}

module.exports = {getTemperature};