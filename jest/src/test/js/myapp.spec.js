
const Vue = require('vue/dist/vue.min.js');

const appRoot = '../../main/js';
//const appRoot = '../../../webapp';

// TODO
window.Vue = Vue;

const $ = require('jquery');

test('myapp main', function() {

  document.body.innerHTML = `<my-app id="app"></my-app>`;

  var vm = require(`${appRoot}/main.js`);

  expect(typeof vm).toBe('object');

});
