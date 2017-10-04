import { translate } from './translate';

document.addEventListener('DOMContentLoaded', () => {
  let inputWord;
  const form = document.getElementById('form');

  form.onsubmit = () => {
    event.preventDefault();
    inputWord = document.getElementById('input-word').value;
    translate(inputWord); //invokes translate function
  };
})
