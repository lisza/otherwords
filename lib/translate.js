import { langs } from './languages';

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
          results[keys[i]] = text;
        }
      }
      console.log("RESPONSE RETURN", results);

      Object.keys(results).forEach((lang) => {
        let li = document.createElement("li");
        li.innerHTML = `${lang} : ${results[lang]}`;
        document.getElementById('result').append(li);
      })

      return results;
      // console.log(response.result['mk']);
    })
  })
}

// gapi.load('client', start);
gapi.load('client');
