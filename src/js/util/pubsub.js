/**
 * incredibly simple pub-sub
 * @param {object} object - object to extend
 */
var addPubsub = function (object) {
  'use strict';
  
  object.prototype.on = function (eventName, callback) {
    if (!this.__callbacks) {
      this.__callbacks = {};
    }
    
    if (!this.__callbacks[eventName]) {
      this.__callbacks[eventName] = [];
    }
    
    this.__callbacks[eventName].push(callback);
    if (this.__callbacks[eventName].deferred) {
      callback(this.__callbacks[eventName].data);
    }
    
    return this;
  };
  
  object.prototype.trigger = function (eventName, data, deferred) {
    if (!this.__callbacks || !this.__callbacks[eventName]) {
      if (deferred) {
        this.__callbacks = this.__callbacks || {};
      
        this.__callbacks[eventName] = [];
        this.__callbacks[eventName].deferred = true;
        this.__callbacks[eventName].data = data;
      }
      
      return;
    }
    
    this.__callbacks[eventName].forEach(function (callback) {
      callback(data);
    });
    
    return this;
  };
};