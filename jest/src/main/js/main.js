
'use strict'

// TODO
const Vue = window.Vue;

module.exports = new Vue({
  el : '#app',
  components : {
    'MyApp' : require('./MyApp.vue').default
  },
  data : {
    zz : 'hello'
  },
  mounted : function() {
    console.log('mounted.', this.$children.length);
  }
});
