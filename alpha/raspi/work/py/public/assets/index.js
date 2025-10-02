Vue.createApp({
  data : function() {
    return {
      msg : 'hello!'
    };
  },
  mounted : function() {
    const wsapp = createWsApp({
      url : 'ws://172.31.255.1:8765',
      login : { action:'puke', login : 'puke' },
    });
    wsapp.actions.aaa = function() {
      
    };
    //wsapp.send({ action:'puke'});

  },
}).mount('#app');
