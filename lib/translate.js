import { langs } from './languages_util';
import levenshtein from 'js-levenshtein';

console.log(levenshtein('brood', 'brot'));

export const translate = function(inputWord) {
  console.log("input word: ", inputWord);
  let results = {};

  gapi.client.init({
    'apiKey': 'AIzaSyCQV4_CcQgx8HAF8se5arEyNXsvlZ9YKQY',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
  }).then(function() {

    const batch = gapi.client.newBatch();

    Object.keys(langs).forEach((lang) => {
      const getTranslations = (lang) => {
        return gapi.client.language.translations.list({
          q: inputWord,
          // source: 'en', //should get auto detected
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
          // results[keys[i]] = text;
          let distance = levenshtein(inputWord, text);

          results[keys[i]] = {
            'text': text,
            'distance': distance,
            'letter': text[0].toLowerCase(),
            'lang': langs[keys[i]]}
        }
      }
      // console.log(response.result['mk']);
      console.log("RESPONSE RETURN", results);
      // displayResults(results);
      generateGrid();
      populateGrid(results);
    })
  })
  return results;
}

// gapi.load('client', start);
gapi.load('client');

// const displayResults = (results) => (
//   Object.keys(results).forEach((lang) => {
//   let li = document.createElement("li");
//   li.innerHTML = `${lang} : ${results[lang]}`;
//   document.getElementById('result').append(li);
//   })
// );

const generateGrid = () => {
  const abc = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
  const grid = document.getElementById('grid');

  for(let i = 0; i < 10; i++) {
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
    //create new div for each word, append to parentId element
    if (parentElement) {
      let wordDiv = document.createElement('div');
      wordDiv.id = key;
      wordDiv.innerHTML = word.text;
      parentElement.appendChild(wordDiv);
    }
  })
};
