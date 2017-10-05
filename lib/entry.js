import { translate } from './translate';
let results = {};

document.addEventListener('DOMContentLoaded', () => {
  let inputWord;
  const form = document.getElementById('form');

  form.onsubmit = async function() {
    event.preventDefault();
    inputWord = document.getElementById('input-word').value;

    //clear old list items here
    const resultList = document.getElementById('grid'); // change id to wherever my results live
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }
    results = inputWord ? await translate(inputWord) : null;

    console.log("ONSUBMIT RETURN", results);
  };
})
