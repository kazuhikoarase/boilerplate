'use strict';

var http = require('http');
var fs = require('fs');

console.log('hi');
console.log('hi', __dirname);
var test = function(path) {
  if (!fs.existsSync(path) ) {
    console.log(path, 'not found');
    return;
  }
  var stats = fs.statSync(path);
  if (stats.isFile() ) {
    console.log(path, 'is file');
  } else if (stats.isDirectory() ) {
    console.log(path, 'is directory');
    fs.readdirSync(path).forEach(function(path, i) {
      console.log('-', i, path);
    });
    
  }
};
test('ntest.js');
test('ntest.jsp');
test('lib');
