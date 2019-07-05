const axios = require("axios");

/**
 * TODO: Set params
 * @returns {Object}
 */
const netflixSuggestions = async () => {
  try {
    const API_URL = `https://api.reelgood.com/roulette/netflix?availability=onAnySource&content_kind=both&nocache=true`;
    const { status, data } = await axios.get(API_URL);

    console.log(data);
    if (status === 200) {
      return {
        data
      };
    }
  } catch (error) {
    return error;
  }
};

module.exports = netflixSuggestions;
