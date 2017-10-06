import { translate } from './translate';
let results = {};

document.addEventListener('DOMContentLoaded', () => {
  let inputWord;
  const form = document.getElementById('form');

  form.onsubmit = async function() {
    event.preventDefault();
    inputWord = document.getElementById('input-word').value;

    // Clear old results here
    const resultList = document.getElementById('grid');
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }
    results = inputWord ? await translate(inputWord) : null;
  };
})
