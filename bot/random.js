/**
 * Shuffles through different options, and returns a single result
 * @param {{String}} content The content from the message
 */
async function shuffle({ content }) {
  const removeThis = "papurri random";
  const [...options] = content.split(",");
  const randomIndex = Math.round(Math.random() * (options.length - 1));

  if (!options[randomIndex])
    throw new Error("Index out of bound! Or something worse :v");

  let result = options[randomIndex].trim();

  if (randomIndex == 0) {
    result = result.slice(removeThis.length);
  }

  if (result.trim() == "")
    return "Tenés que escribir algo de opciones, mogolico >:v";

  return `${randomCongrats()}, apareció **\`${result.trim()}\`**`;
}

function randomCongrats() {
  const congrats = [
    "bueeenaaa",
    "bien ahi",
    "tuki",
    "apa apa",
    "WENA",
    "APA",
    "eu que onda",
    "que paso aca",
    "mmmm",
    "hmmm",
    "haber"
  ];
  const randomIndex = Math.round(Math.random() * (congrats.length - 1));
  return congrats[randomIndex];
}

module.exports = shuffle;
