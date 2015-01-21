<h1>10-way equalizer</h1>

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
  audio: '.my-audio-element', // selector of your audio element
  inputs: '.my-inputs', // selector of input elements, if they already exist.
  // otherwise, you can specify container element (existing).
  // input elements will be created and append to this container.
  container: '.my-container'
});
```
