$(function() {
  Vue.createApp({
    data : function() {
      return {
        msg : 'hi!'
      }
    },
    watch : {
    },
    methods : {
    },
    mounted : function() {
      console.log('hi!');
    }
  }).mount('#app');
});
