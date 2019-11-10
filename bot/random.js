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

  return `Tuki, apareció **\`${result.trim()}\`**`;
}

module.exports = shuffle;
