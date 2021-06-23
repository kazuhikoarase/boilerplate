'use strict';

!function() {

  var extend = toolkit.extend;
  var assertEquals = toolkit.assertEquals;
  var createEventTarget = toolkit.createEventTarget;
  var createElement = toolkit.createElement;

  var o1 = {a: '1', b: '3'};
  var o2 = {a: '2'};
  assertEquals(0, assertEquals.passed);
  assertEquals('1', '1');
  assertEquals('1', extend({}, o1).a);
  assertEquals('2', extend({}, o1, o2).a);
  assertEquals('3', extend({}, o1, o2).b);
  assertEquals('1', o1.a);

  var c = 0;
  var l = function(event, count) { c += count; };
  var et = createEventTarget().on('test', l);
  et.trigger('test', 3);
  assertEquals(3, c);
  et.off('test', l);
  et.trigger('test', 3);
  assertEquals(3, c);
  et.on('test', l);
  et.trigger('test', -3);
  assertEquals(0, c);

  console.log(new Date(), 'passed: ' + assertEquals.passed);

}();
