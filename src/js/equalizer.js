
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Equalizer = factory();
  }
  
}(this, function () {
  'use strict';
  
  // if it's not supported - do nothing
  if (!window.AudioContext && !window.webkitAudioContext) {
    return function () {};
  }
  
  var
    $$ = document.querySelectorAll.bind(document),
    $ = document.querySelector.bind(document);
  
  var
    Equalizer = function (param) {
      /** AudioContext object */
      this.context = (function () {
        // avoid multiple AudioContext creating
        return (window.Equalizer && window.Equalizer.context) ||
          new AudioContext();
      }());

      this.frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

      this.length = this.frequencies.length;
    
      this.initInputs(param);
      
      this.createFilters();
      this.initInputsAttrs();
      this.initEvents();
      this.connectEqualizer();
    };

  /**
   * creates input elements
   * @param {HTMLElement} container
   * @returns [HTMLElement]
   */
  Equalizer.prototype.createInputs = function (container) {
    var
      inputs = [],
      node,
      i;

    for (i = 0; i < this.length; i++) {
      node = document.createElement('input');
      container.appendChild(node);
      inputs.push(node);
    }

    return inputs;
  };
    
  /**
   * init inputs range and step
   */
  Equalizer.prototype.initInputsAttrs = function () {
    [].forEach.call(this.inputs, function (item) {
      item.setAttribute('min', -16);
      item.setAttribute('max', 16);
      item.setAttribute('step', 0.1);
      item.setAttribute('value', 0);
      item.setAttribute('type', 'range');
    });
  };
    
  /**
   * bind input.change events to the filters
   */
  Equalizer.prototype.initEvents = function () {
    var
      self = this;
    
    [].forEach.call(this.inputs, function (item, i) {
      item.addEventListener('change', function (e) {
        self.filters[i].gain.value = e.target.value;
      }, false);
    });
  };

  /**
   * creates single BiquadFilter object
   * @param frequency {number}
   * @returns {BiquadFilter}
   */
  Equalizer.prototype.createFilter = function (frequency) {
    var
      filter = this.context.createBiquadFilter();

    filter.type = 'peaking';
    filter.frequency.value = frequency;
    filter.gain.value = 0;
    filter.Q.value = 1;

    return filter;
  };

  /**
   * create filter for each frequency and connect 
   */
  Equalizer.prototype.createFilters = function () {
    // create filters
    this.filters = this.frequencies.map(this.createFilter.bind(this));

    // create chain
    this.filters.reduce(function (prev, curr) {
      prev.connect(curr);
      return curr;
    });
  };

  /**
   * check param and create input elements if necessary
   * @returns {array|NodeList} input elements
   */
  Equalizer.prototype.initInputs = function (param) {
    if (!param) {
      throw new TypeError('equalizer: param required');
    }

    var
      container = $(param.container),
      inputs = $$(param.inputs);

    if (param.audio instanceof HTMLMediaElement) {
      this.audio = param.audio;
    } else if (typeof param.audio === 'string') {
      this.audio = $(param.audio);

      if (!this.audio) {
        throw new TypeError('equalizer: there\'s no element that match selector' +
          param.audio);
      }
    } else {
      throw new TypeError('equalizer: parameter "audio" must be string or an audio element');
    }

    if (!container && !inputs.length) {
      throw new TypeError('equalizer: there\'s no elements match "' +
        param.container + '" or "' + param.selector);
    }

    if (!inputs.length) {
      inputs = this.createInputs(container);
    }
    
    this.inputs = inputs;
  };

  /**
   * create a chain
   */
  Equalizer.prototype.connectEqualizer = function () {
    var
      source = this.context.createMediaElementSource(this.audio);

    source.connect(this.filters[0]);
    this.filters[this.length - 1].connect(this.context.destination);
  };
  
  return Equalizer;
}));