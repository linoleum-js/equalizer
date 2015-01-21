<h1>10-way equalizer</h1>

An [article](http://habrahabr.ru/post/240819/) about how it works (_rus_)
[Lits](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) of supported formats.

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
equalizer({
  audio: '.my-audio-element', // selector of your audio element (existing)
  inputs: '.my-inputs', // selector of input elements, if they already exist.
  // otherwise, you can specify container element (existing).
  // input elements will be created and append to this container.
  container: '.my-container'
});
```
