/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _translate = __webpack_require__(1);

var results = {};

document.addEventListener('DOMContentLoaded', function () {
  var inputWord = void 0;
  var form = document.getElementById('form');

  form.onsubmit = function () {
    event.preventDefault();
    inputWord = document.getElementById('input-word').value;

    // Clear old results here
    var resultList = document.getElementById('grid');
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }

    results = inputWord ? (0, _translate.translate)(inputWord) : null;
  };
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = undefined;

var _languages = __webpack_require__(2);

var _jsLevenshtein = __webpack_require__(3);

var _jsLevenshtein2 = _interopRequireDefault(_jsLevenshtein);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translate = exports.translate = function translate(inputWord) {
  var results = {};

  gapi.client.init({
    // NOTE: API key is secured by Google Cloud Services such that only requests coming
    // from this site are processed.
    'apiKey': 'AIzaSyCQV4_CcQgx8HAF8se5arEyNXsvlZ9YKQY',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest']
  }).then(function () {

    var batch = gapi.client.newBatch();

    Object.keys(_languages.langs).forEach(function (lang) {
      var getTranslations = function getTranslations(lang) {
        return gapi.client.language.translations.list({
          q: inputWord,
          // source: 'en', //source language is auto detected
          target: lang
        });
      };
      batch.add(getTranslations(lang), { 'id': lang });
    });

    batch.then(function (response) {
      var keys = Object.keys(response.result);
      for (var i = 0; i < keys.length; i++) {
        if (response.result[keys[i]].status === 200) {
          var text = response.result[keys[i]].result.data.translations[0].translatedText;
          var distance = (0, _jsLevenshtein2.default)(inputWord, text);

          results[keys[i]] = {
            'text': text,
            'distance': distance,
            'letter': text[0].toLowerCase(),
            'language': _languages.langs[keys[i]] };
        }
      }
      generateGrid();
      populateGrid(results);
    });
  });
  return results;
};

gapi.load('client');

var generateGrid = function generateGrid() {
  var abc = Array.from({ length: 26 }, function (_, i) {
    return String.fromCharCode('a'.charCodeAt(0) + i);
  });
  var grid = document.getElementById('grid');

  for (var i = 0; i < 13; i++) {
    var row = document.createElement('div');
    row.className = 'row';
    row.id = 'row-' + i;
    grid.appendChild(row);

    for (var j = 0; j < abc.length; j++) {
      var field = document.createElement('div');
      field.className = 'field';
      field.id = i + '-' + abc[j];
      row.appendChild(field);
    }
  }
};

var populateGrid = function populateGrid(results) {
  Object.keys(results).forEach(function (key) {
    var word = results[key];
    var parentId = word.distance + '-' + word.letter;
    var parentElement = document.getElementById(parentId);

    // Create new div for each word, append to parentId element
    if (parentElement) {
      var wordDiv = document.createElement('div');
      wordDiv.id = key;
      wordDiv.innerHTML = word.text;

      // Add tooltip span element inside of div
      var tooltip = document.createElement('span');
      tooltip.className = "tooltiptext";
      tooltip.innerHTML = word.language;
      wordDiv.appendChild(tooltip);

      // Show language tooltips onclick for touch screens
      addOnclickEvent(wordDiv, tooltip);

      // Calculate border color based on word distance
      wordDiv.style.border = '1px solid rgb(180, ' + word.distance * 40 + ', 180)';

      parentElement.appendChild(wordDiv);
    }
  });
};

var addOnclickEvent = function addOnclickEvent(wordDiv, tooltip) {
  // Check if ‘ontouchstart’ in document, if true, add click events since css :hover won't work
  console.log('onclick', wordDiv);
  // if ('ontouchstart' in document) {
  wordDiv.onclick = function (e) {
    // console.log('ontouchstart', tooltip);
    console.log('wordDiv', wordDiv);
    console.log('e.target', e.target);
    // Remove old tooltips, show current one
    var oldTooltips = document.getElementsByClassName('visible');
    Array.from(oldTooltips).forEach(function (el) {
      return el.classList.remove('visible');
    });
    tooltip.classList.add('visible');
  };
  // }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

var langs = exports.langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    // 'am': 'Amharic',
    // 'ar': 'Arabic',
    // 'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    // 'be': 'Belarusian',
    // 'bn': 'Bengali',
    'bs': 'Bosnian',
    // 'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    // 'zh-cn': 'Chinese Simplified',
    // 'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    // 'ka': 'Georgian',
    'de': 'German',
    // 'el': 'Greek',
    // 'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    // 'iw': 'Hebrew',
    // 'hi': 'Hindi',
    // 'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    // 'ja': 'Japanese',
    // 'jw': 'Javanese',
    // 'kn': 'Kannada',
    // 'kk': 'Kazakh',
    // 'km': 'Khmer',
    // 'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    // 'ky': 'Kyrgyz',
    // 'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    // 'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    // 'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    // 'mr': 'Marathi',
    // 'mn': 'Mongolian',
    // 'my': 'Myanmar (Burmese)',
    // 'ne': 'Nepali',
    'no': 'Norwegian',
    // 'ps': 'Pashto',
    // 'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    // 'ma': 'Punjabi',
    'ro': 'Romanian',
    // 'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    // 'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    // 'sd': 'Sindhi',
    // 'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    // 'tg': 'Tajik',
    // 'ta': 'Tamil',
    // 'te': 'Telugu',
    // 'th': 'Thai',
    'tr': 'Turkish',
    // 'uk': 'Ukrainian',
    // 'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    // 'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (function()
{
  function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }

  return function(a, b)
  {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb === 1) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    for (; (x + 3) < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < vector.length; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }
    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < vector.length; y += 2) {
        dy = vector[y];
        vector[y] = dd = dy < d0 || dd < d0
            ? dy > dd ? dd + 1 : dy + 1
            : bx0 === vector[y + 1]
                ? d0
                : d0 + 1;
        d0 = dy;
      }
    }

    return dd;
  };
})();



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map