
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
  
  var
    $$ = document.querySelectorAll.bind(document),
    $ = document.querySelector.bind(document);
  
  var
    Equalizer = function (param) {
      // if it's not supported - do nothing
      if (!window.AudioContext && !window.webkitAudioContext) {
        this.trigger('error', {
          message: 'AudioContext not supported'
        }, true);
        
        return;
      }
      
      /** AudioContext object */
      // avoid multiple AudioContext creating
      this.context = window.__context || new AudioContext();
      window.__context = this.context;

      this.frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

      this.length = this.frequencies.length;
      
      this.connected = false;
    
      this.initInputs(param);
      
      this.createFilters();
      this.initInputsAttrs();
      this.initEvents();
      this.connectEqualizer();
    };
  
  // <### pubsub ###>
  addPubsub(Equalizer);

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
        
        self.trigger('change', {
          value: e.target.value,
          inputElement: e.target,
          index: i
        });
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
   *
   * @holycrap {WTF} Why Must Life Be So Hard http://www.youtube.com/watch?v=rH48caFgZcI
   *
   * @returns {array|NodeList} input elements
   */
  Equalizer.prototype.initInputs = function (param) {
    if (!param) {
      throw new TypeError('equalizer: param required');
    }

    var
      container,
      inputs = [];

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
    
    // container specified
    if (param.container) {
      // css selector
      if (typeof param.container === 'string') {
        container = $(param.container);
        if (!container) {
          throw new TypeError('equalizer: there\'s no element that match selector' +
            param.container);
        }
        // plain html element
      } else if (param.container instanceof HTMLElement) {
        container = param.container;
        // jquery object
      } else if (param.container.jquery && param.container[0]) {
        container = param.container[0];
      } else {
        throw new TypeError('equalizer: invalid parameter container: ' + param.container);
      }
      
      inputs = this.createInputs(container);
    } else {
      // no container
      if (typeof param.inputs === 'string') {
        inputs = $$(param.inputs);
        // plainh html collection
      } else if (param.inputs instanceof NodeList) {
        inputs = param.inputs;
        // jquery object
      } else if (param.inputs.jquery) {
        param.inputs.each(function (i, item) {
          inputs.push(item);
        });
      } else {
        throw new TypeError('equalizer:  invalid parameter inputs: ' + param.container);
      }
    }
    
    if (inputs.length !== this.length) {
      throw new TypeError('equalizer: required exactly ' + this.length + ' elements, but ' +
        inputs.length + ' found');
    }
    
    this.inputs = inputs;
  };

  /**
   * create a chain
   */
  Equalizer.prototype.connectEqualizer = function () {
    this.source = this.context.createMediaElementSource(this.audio);

    this.source.connect(this.filters[0]);
    this.filters[this.length - 1].connect(this.context.destination);
  };
  
  Equalizer.prototype.disconnect = function () {
    this.trigger('disconnect', {});
    this.source.disconnect();
    this.source.connect(this.destination);
    
    return this;
  };
  
  Equalizer.prototype.connect = function () {
    this.trigger('connect', {});
    this.source.disconnect();
    this.source.connect(this.filters[0]);
    
    return this;
  };
  
  return Equalizer;
}));