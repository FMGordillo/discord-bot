const axios = require("axios");

/**
 * @returns {String}
 */
const netflixSuggestions = async () => {
  try {
    const API_URL = `https://api.reelgood.com/roulette/netflix?availability=onAnySource&content_kind=both&nocache=true`;
    const { status, data } = await axios.get(API_URL);

    if (status === 200) {
      return `Te recomiendo **${data.title}** \n > ${data.overview}`;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = netflixSuggestions;
