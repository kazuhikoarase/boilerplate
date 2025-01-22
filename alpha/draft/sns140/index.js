$(function() {
  Vue.createApp({
    data : function() {
      return {
        msg : 'hi!↓あああ'
      }
    },
    computed : {
      msgList : function() {
        var sep = '↓';
        var msgList = this.msg.split(new RegExp(sep, 'g') ).map(function(msg, i) {
          return msg.replace(/(^\s+)|(\s+$)/g, '');
        });
        msgList = msgList.map(function(msg, i) {
          return msg + (i < msgList.length - 1? '\r\n\r\n' + sep : '');
        });
        return msgList;
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
