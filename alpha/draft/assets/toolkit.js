
var toolkit = function() {

  var extend = function() {
    var o = arguments[0];
    for (var i = 1; i < arguments.length; i += 1) {
      var a = arguments[i];
      for (var k in a) {
        o[k] = a[k];
      }
    }
    return o;
  };

  var assertEquals = extend(function(expected, actual) {
    if (expected !== actual) {
      throw 'expected ' + expected + ' but ' + actual;
    }
    assertEquals.passed += 1;
  }, { passed: 0 });

  var createEventTarget = function() {
    var map = {};
    var listeners = function(type) {
      return map[type] || (map[type] = []);
    };
    return {
      trigger: function(type, detail) {
        var target = this;
        var event = { type: type };
        listeners(type).forEach(function(l) {
          l.call(target, event, detail);
        })
        return this;
      },
      on: function(type, listener) {
        listeners(type).push(listener);
        return this;
      },
      off: function(type, listener) {
        map[type] = listeners(type).filter(function(l) {
          return l != listener;
        });
        return this;
      }
    };
  };

  var wrapObject = function(elm) {
    return {
      $el: elm,
      $attrs: function(o) {
        for (var k in o) {
          this.$el.setAttribute(k, o[k]);
        }
        return this;
      },
      $props: function(o) {
        for (var k in o) {
          this.$el[k] = o[k];
        }
        return this;
      },
      $style: function(o) {
        for (var k in o) {
          this.$el.style[k] = o[k];
        }
        return this;
      },

      $on: function(o) {
        for (var k in o) {
          this.$el.addEventListener(k, o[k]);
        }
        return this;
      },
      $off: function(o) {
        for (var k in o) {
          this.$el.removeEventListener(k, o[k]);
        }
        return this;
      },

      $parent: null,
      $children: [],
      $append: function() {
        for (var i = 0; i < arguments.length; i += 1) {
          var a = arguments[i];
          a.$parent = this;
          this.$children.push(a);
          this.$el.appendChild(a.$el);
        }
        return this;
      },
      $remove: function() {
        for (var i = 0; i < arguments.length; i += 1) {
          var a = arguments[i];
          var index = this.$children.indexOf(a);
          if (index != -1) {
            a.$parent = null;
            this.$children[index] = null;
            this.$el.removeChild(a.$el);
          }
        }
        // remove null objects.
        var children = [];
        for (var i = 0; i < this.$children.length; i += 1) {
          var c =this.$children[i];
          if (c != null) {
            children.push(c);
          }
        }
        this.$children = children;
        return this;
      }
    };
  };

  var createElement = function(tagName) {
    return wrapObject(document.createElement(tagName) );
  };

  var createSVGElement = function(tagName) {
    return wrapObject(document.createElementNS(
        'http://www.w3.org/2000/svg', tagName) );
  };

  return {
    assertEquals: assertEquals,
    extend: extend,
    createEventTarget: createEventTarget,
    wrapObject: wrapObject,
    createElement: createElement,
    createSVGElement: createSVGElement
  };
}();
