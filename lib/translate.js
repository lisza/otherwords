import { langs } from './languages';
import levenshtein from 'js-levenshtein';

export const translate = function(inputWord) {
  let results = {};

  gapi.client.init({
    // NOTE: API key is secured by Google Cloud Services such that only requests coming
    // from this site are processed.
    'apiKey': 'AIzaSyCQV4_CcQgx8HAF8se5arEyNXsvlZ9YKQY',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
  }).then(function() {

    const batch = gapi.client.newBatch();

    Object.keys(langs).forEach((lang) => {
      const getTranslations = (lang) => {
        return gapi.client.language.translations.list({
          q: inputWord,
          // source: 'en', //source language is auto detected
          target: lang,
        });
      };
      batch.add(getTranslations(lang), {'id': lang});
    })

    batch.then(function(response) {
      let keys = Object.keys(response.result)
      for(let i = 0; i < keys.length; i++) {
        if (response.result[keys[i]].status === 200) {
          let text = response.result[keys[i]].result.data.translations[0].translatedText;
          let distance = levenshtein(inputWord, text);

          results[keys[i]] = {
            'text': text,
            'distance': distance,
            'letter': text[0].toLowerCase(),
            'language': langs[keys[i]]}
        }
      }
      generateGrid();
      populateGrid(results);
    })
  })
  return results;
}

gapi.load('client');

const generateGrid = () => {
  const abc = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
  const grid = document.getElementById('grid');

  for(let i = 0; i < 13; i++) {
    let row = document.createElement('div');
    row.className = 'row';
    row.id = `row-${i}`;
    grid.appendChild(row);

    for(let j = 0; j < abc.length; j++) {
      let field = document.createElement('div');
      field.className = 'field';
      field.id = `${i}-${abc[j]}`;
      row.appendChild(field);
    }
  }
};

const populateGrid = (results) => {
  Object.keys(results).forEach((key) => {
    let word = results[key];
    let parentId = `${word.distance}-${(word.letter)}`;
    let parentElement = document.getElementById(parentId);

    // Create new div for each word, append to parentId element
    if (parentElement) {
      let wordDiv = document.createElement('div');
      wordDiv.id = key;
      wordDiv.innerHTML = word.text;

      // Add tooltip span element inside of div
      let tooltip = document.createElement('span');
      tooltip.className = "tooltiptext";
      tooltip.innerHTML = word.language;
      wordDiv.appendChild(tooltip);

      // Show language tooltips onclick for touch screens
      if ('ontouchstart' in document) addOnclickEvent(wordDiv, tooltip);

      // Calculate border color based on word distance
      wordDiv.style.border = `1px solid rgb(180, ${word.distance * 40}, 180)`;

      parentElement.appendChild(wordDiv);
    }
  })
};

const addOnclickEvent = (wordDiv, tooltip) => {
  wordDiv.onclick = () => {
    // Remove old tooltips, show current one
    let oldTooltips = document.getElementsByClassName('visible');
    Array.from(oldTooltips).forEach(el => el.classList.remove('visible'));
    tooltip.classList.add('visible');
  }
};
