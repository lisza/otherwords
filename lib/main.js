// const translate = require('google-translate-api');

document.write("Webpack works");

const form = document.getElementById("form");

form.onsubmit = function() {
  event.preventDefault();
  console.log("submitted");
  const word = document.getElementById("word").value;
  console.log(word);
  return word;
}
