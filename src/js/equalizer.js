(function () {
  'use strict';
  
  var context = null,
    audio = null,
    
    filters = [],
      
    $$ = document.querySelectorAll.bind(document),
    $ = document.querySelector.bind(document),
      
    createContext = function () {
      var previous = window.equalizer;
  
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
      var inputs = [],
        node,
        i;
      
      for (i = 0; i < 10; i++) {
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
      var filter = context.createBiquadFilter();
     
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.gain.value = 0;
      filter.Q.value = 2;

      return filter;
    },
    
    /**
     * create filter for each frequency
     */
    createFilters = function () {
      var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
      
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
      
      if (!inputs) {
        inputs = createInputs(param.selector, container);
      }
      
      return inputs;
    },
    
    /**
     * create a chain
     */
    bindEqualizer = function () {
      var source = context.createMediaElementSource(audio);
      
      source.connect(filters[0]);
      filters[9].connect(context.destination);
    },
    
    /**
     * main function
     */
    equalizer = function (param) {
      var inputs = validateParam(param);
      
      createContext();
      createFilters();
      initInputsData(inputs);
      initEvents(inputs);
      bindEqualizer();
    };
  
  equalizer.context = context;
  
  window.equalizer = equalizer;
}());