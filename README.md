<h1>10-way equalizer</h1>

An [article](http://habrahabr.ru/post/240819/) about how it works (_rus_)<br>
[List](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) of supported formats.<br>
[Can i use](http://caniuse.com/#feat=audio-api) - support of Web Audio API

<b>[Try it online](http://martinschulz.github.io/equalizer/)</b>

<h3>Usage:</h3>
* Add script to your html:
```html
  <script src="path/to/equalizer.min.js"></script>
  <script>
    // your code goes here *
  </script>
```
or _require_ it
```javascript
require([
  'path/to/equalizer'
], function (equalizer) {
  // or here *
});
```
* Use it:
```javascript
var equalizer = new Equalizer({
  audio: '.my-audio-element', // css selector of your audio element or element itself (existing)
  inputs: '.my-inputs', // css selector of input elements or NodeList itself, if they already exist
  // otherwise, you can specify container element (existing).
  // input elements will be created and append to this container.
  container: '.my-container' // css selector of container element or element itself
});
// (jQuery objects are also allowed)

// then you can turn off it
equalizer.disconnect();
// and turn on
equalizer.connect();
```
Also there's couple of events:
```javascript
new Equalizer({
  /* param */
}).on('error', function (data) {
  // do some error stuff. i.e. hide controls
  console.log(data.message);
}).on('change', function (data) {
  console.log('input no.' + data.index + ' changed. new value is ' + data.value);
});
```
Full list of events available for now:
<i>error, change, disconnect, connect</i>


