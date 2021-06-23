!function() {

  'use strict';

  //-- test utils

  var assertEquals = function(expected, actual, omitThrow) {
    if (expected === actual) {
      return true;
    } else {
      if (omitThrow) {
        return false;
      } else {
        throw 'expected ' + JSON.stringify(expected) +
          ' but ' + JSON.stringify(actual);
      }
    }
  };

  var assertNotEquals = function(expected, actual, omitThrow) {
    if (expected !== actual) {
      return true;
    } else {
      if (omitThrow) {
        return false;
      } else {
        throw 'expected NOT ' + JSON.stringify(expected) +
          ' but ' + JSON.stringify(actual);
      }
    }
  };

  //-- basic

  var extend = function(o) {
    for (var i = 1; i < arguments.length; i += 1) {
      var a = arguments[i];
      for (var k in a) {
        o[k] = a[k];
      }
    }
    return o;
  };

  var attachEventModel = function(o) {
    var listeners = null;
    return extend(o, {
      trigger: function(type, detail) {
        var event = { type: type };
        (listeners || []).forEach(function(l) {
          l(event, detail);
        });
      },
      on: function(type, l) {
        (listeners || (listeners = []) ).push(l);
      },
      off: function(type, l) {
        listeners = (listeners || []).filter(function(_l) {
          return _l != l;
        });
      }
    });
  };

  var domWrapper = function() {

    var svgTagNames = {};
    'svg g path rect circle'.split(/\s+/g).forEach(function(tagName) {
      svgTagNames[tagName] = true;
    });

    return function(elm) {
      if (typeof elm == 'string') {
        elm = svgTagNames[elm]?
            document.createElementNS('http://www.w3.org/2000/svg', elm) :
              document.createElement(elm);
      }
      return {
        $el: elm,
        on: function(type, l) {
          this.$el.addEventListener(type, l);
          return this;
        },
        off: function(type, l) {
          this.$el.removeEventListener(type, l);
          return this;
        },
        attrs: function(params) {
          for (var k in params) {
            this.$el.setAttribute(k, params[k]);
          }
          return this
        },
        props: function(params) {
          for (var k in params) {
            this.$el[k] = params[k];
          }
          return this
        },
        style: function(params) {
          for (var k in params) {
            this.$el.style[k] = params[k];
          }
          return this
        },
        append: function($elm) {
          this.$el.appendChild($elm.$el);
          return this;
        },
        remove: function($elm) {
          this.$el.removeChild($elm.$el);
          return this;
        }
      };
    };
  }();

  //-- test

  window.addEventListener('load', function() {

    !function() {
      assertEquals(true, assertEquals('1', '1') );
      assertEquals(true, assertEquals(1, 1) );
      assertEquals(false, assertEquals(1, '1', true) );
      assertEquals(true, assertNotEquals(1, '1') );
      assertEquals(false, assertNotEquals('1', '1', true) );
      assertEquals(false, assertNotEquals(1, 1, true) );
    }();

    !function() {
      var o = {a: 1, b: 2};
      assertEquals(1, o.a);
      assertEquals(2, o.b);
      o = extend(o, {b:3, c:4});
      assertEquals(3, o.b);
      assertEquals(4, o.c);
    }();

    !function() {

      var o = {};
      var count = 0;
      var l = function(event, detail) {
        count += detail;
      };
      attachEventModel(o);

      assertEquals(0, count);

      o.on('test', l);
      assertEquals(0, count);
      o.trigger('test', 123);
      assertEquals(123, count);
      o.trigger('test', -123);

      assertEquals(0, count);

      o.off('test', l);
      assertEquals(0, count);
      o.trigger('test', 123);
      assertEquals(0, count);
      o.trigger('test', -123);

      assertEquals(0, count);

    }();

    !function() {

      var $ = domWrapper;

      var $elm = $('div').style({ width: '100px', height: '50px',
        border: '1px solid blue', padding: '2px', margin: '4px' });
      $(document.body).append($elm);

      assertEquals(106 /* width  + padding + border */, $elm.$el.offsetWidth);
      assertEquals(56  /* height + padding + border */, $elm.$el.offsetHeight);
      assertEquals(104 /* width  + padding */, $elm.$el.clientWidth);
      assertEquals(54  /* height + padding */, $elm.$el.clientHeight);

      var $svg = $('svg').attrs({ width: '100', height: '100' }).
        append($('rect').attrs({ width: 50, height: 50, fill: 'red' }) ).
        append($('rect').attrs({ x: 50, width: 50, height: 50,
          fill: 'green' }) ).
        append($('rect').attrs({ y: 50, width: 50, height: 50,
          fill: 'blue' }) ).
        append($('rect').attrs({ x: 50, y: 50, width: 50, height: 50,
          fill: 'orange' }) );
      $(document.body).append($svg);
    }();

    !function() {
    }();

    console.log('test complete.');
  });

}();
