'use strict';

var domutil = function() {

  var eventTarget = function(tagName, factory) {
    var _this = this;
    var map = {};
    var listeners = function(type) {
      return map[type] || (map[type] = []);
    };
    Object.defineProperty(_this, '$emit', {
      get: function() {
        return function(type, data) {
          listeners(type).forEach(function(l) {
            l.call(this, data);
          }.bind(this));
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, '$on', {
      get: function() {
        return function(type, listener) {
          listeners(type).push(listener);
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, '$off', {
      get: function() {
        return function(type, listener) {
          map[type] = listeners(type).filter(function(l) {
            return l != listener;
          });
          return this;
        }.bind(this);
      }
    });
    return _this;
  };

  var domWrapper = function($el) {
    var _this = eventTarget.call({});
    Object.defineProperty(_this, '$el', {
      get: function() { return $el; }
    });
    Object.defineProperty(_this, 'children', {
      get: function() {
        return function(children) {
          for (var i = 0; i < children.length; i += 1) {
            this.$el.appendChild(children[i]);
          }
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, 'attrs', {
      get: function() {
        return function(attrs) {
          for (var k in attrs) {
            this.$el.setAttribute(k, attrs[k]);
          }
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, 'props', {
      get: function() {
        return function(props) {
          for (var k in props) {
            this.$el[k] = props[k];
          }
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, 'style', {
      get: function() {
        return function(style) {
          for (var k in style) {
            this.$el.style[k] = style[k];
          }
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, 'on', {
      get: function() {
        return function(type, listener) {
          this.$el.addEventListener(type, listener);
          return this;
        }.bind(this);
      }
    });
    Object.defineProperty(_this, 'off', {
      get: function() {
        return function(type, listener) {
          this.$el.removeEventListener(type, listener);
          return this;
        }.bind(this);
      }
    });
    return _this;
  };

  var html = function(tagName) {
    return domWrapper(document.createElement(tagName) );
  };

  var svg = function(tagName) {
    return domWrapper(document.createElementNS(
        'http://www.w3.org/2000/svg', tagName) );
  };

  return {
    eventTarget: eventTarget,
    domWrapper: domWrapper,
    html: html,
    svg: svg
  };
}();
