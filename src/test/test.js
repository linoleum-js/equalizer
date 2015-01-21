require([
  '../js/equalizer'
], function (equalizer) {
  'use strict';

  equalizer({
    audio: '.audio',
    // inputs: '.eq-input'
    container: '.eq-wrap'
  });
});