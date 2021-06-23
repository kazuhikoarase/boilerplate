'use strict'

//var Vue = require('vue.min');
//var Vue = require('vue');
var Vue = require('vue/dist/vue.min.js');
//import Vue from 'vue/dist/vue.min.js';
var $ = require("jquery");
//import $ from "jquery";

//var a = require('./a.js');
import a from './a.js';

var qrcode = require('qrcode-generator');

console.log(qrcode, Vue, a);

$(function() {
  new Vue({
    el : '#app',
    data : {
      zz : 'hello'
    },
    mounted : function() {
      console.log('mounted.');
    }
  });
  console.log('loaded.');
});


function az() {
  console.log(',', typeof window);
  console.log(':', typeof global);
  console.log('window is global', window == global);
}

az();


