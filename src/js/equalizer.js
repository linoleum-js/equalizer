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
    root.equalizer = factory();
  }
  
}(this, function () {
  'use strict';
  
  var
    context = null,
      
    audio = null,
      
    frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000],
      
    length = frequencies.length,
    
    filters = [],
      
    $$ = document.querySelectorAll.bind(document),
    $ = document.querySelector.bind(document),
      
    createContext = function () {
      var
        previous = window && window.equalizer;
  
      // avoid multiple AudioContext creating
      if (previous && previous.context) {
        context = previous.context;
      } else {
        context = new AudioContext();
      }
    },
      
    /**
     * creates 10 input elements
     */
    createInputs = function (className, container) {
      var
        inputs = [],
        node,
        i;
      
      for (i = 0; i < length; i++) {
        node = document.createElement('input');
        // remove dot
        node.className = className.slice(1);
        container.appendChild(node);
        inputs.push(node);
      }
      
      return inputs;
    },
    
    /**
     * init inputs range and step
     */
    initInputsData = function (inputs) {
      [].forEach.call(inputs, function (item) {
        item.setAttribute('min', -16);
        item.setAttribute('max', 16);
        item.setAttribute('step', 0.1);
        item.setAttribute('value', 0);
        item.setAttribute('type', 'range');
      });
    },
    
    /**
     * bind input.change events to the filters
     */
    initEvents = function (inputs) {
      [].forEach.call(inputs, function (item, i) {
        item.addEventListener('change', function (e) {
          filters[i].gain.value = e.target.value;
        }, false);
      });
    },
    
    /**
     * @param frequency {number}
     */
    createFilter = function (frequency) {
      var
        filter = context.createBiquadFilter();
     
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.gain.value = 0;
      filter.Q.value = 1;

      return filter;
    },
    
    /**
     * create filter for each frequency
     */
    createFilters = function () {
      // create filters
      filters = frequencies.map(function (frequency) {
        return createFilter(frequency);
      });
      
      // create chain
      filters.reduce(function (prev, curr) {
        prev.connect(curr);
        return curr;
      });
    },
    
    /**
     * check param
     * @returns {array|NodeList} input elements
     */
    validateParam = function (param) {
      if (!param) {
        throw new TypeError('equalizer: param required');
      }
      
      var container = $(param.container),
        inputs = $$(param.inputs);
      
      if (param.audio instanceof HTMLMediaElement) {
        audio = param.audio;
      } else if (typeof param.audio === 'string') {
        audio = $(param.audio);
        
        if (!audio) {
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
        inputs = createInputs(param.selector || '', container);
      }
      
      return inputs;
    },
    
    /**
     * create a chain
     */
    bindEqualizer = function () {
      var
        source = context.createMediaElementSource(audio);
      
      source.connect(filters[0]);
      filters[length - 1].connect(context.destination);
    },
    
    /**
     * main function
     */
    equalizer = function (param) {
      var
        inputs = validateParam(param);
      
      createContext();
      createFilters();
      initInputsData(inputs);
      initEvents(inputs);
      bindEqualizer();
    };
  
  equalizer.context = context;
  
  return equalizer;
}));