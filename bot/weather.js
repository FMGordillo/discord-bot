const axios = require('axios')

const cityCode='3433955'; //CABA
const appid='9cac08e3c5cce6b0d463cacddcaadee2';
const unit='metric'
let url=`https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${appid}&units=${unit}`


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