import { translate } from './translate';

document.addEventListener('DOMContentLoaded', () => {
  let inputWord;
  const form = document.getElementById('form');
  let results = {};

  form.onsubmit = function() {
    event.preventDefault();

    inputWord = document.getElementById('input-word').value;
    //clear old list items here
    const resultList = document.getElementById('result');
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }


    results = inputWord ? translate(inputWord) : null;

    console.log("ONSUBMIT RETURN", results);
  };
})
