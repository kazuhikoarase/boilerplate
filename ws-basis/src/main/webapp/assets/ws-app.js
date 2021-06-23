//
//
//

'use strict';

var createWsApp = function(opts) {

  var onopen = function(event) {
    alive = true;
    if (opts.login) {
      ws.send(JSON.stringify(opts.login) );
    } else {
      console.log(event);
    }
    
  };

  var onclose = function(event) {
    console.log(event);
    alive = false;
    ws = null;
    reopen();
  };

  var onmessage = function(event) {
    var message = JSON.parse(event.data);
    if (message.action && app.actions[message.action]) {
      app.actions[message.action](message);
    } else {
      console.log(event, event.data);
    }
  };

  var onerror = function(event) {
    console.log(event);
  };

  var initWS = function() {
    var ws = new WebSocket(opts.url);
    ws.onopen = onopen;
    ws.onclose = onclose;
    ws.onmessage = onmessage;
    ws.onerror = onerror;
    return ws;
  };

  var reopen = function() {
    window.setTimeout(function() {
      if (navigator.onLine) {
        ws = initWS();
      } else {
        reopen();
      }
    }, 5000);
  };

  var alive = false;
  var ws = initWS();

  var ajax = function(opts) {

    var parseResponse = function() {

      var contentType = this.getResponseHeader('content-type');
      if (contentType != null) {
        contentType = contentType.replace(/\s*;.+$/, '').toLowerCase();
      }

      if (contentType == 'text/xml' ||
            contentType == 'application/xml') {
        return parser.parseFromString(this.responseText, 'text/xml');
      } else if (contentType == 'text/json' ||
          contentType == 'application/json') {
        return JSON.parse(this.responseText);
      } else {
        return this.response;
      }
    };

    var XMLHttpRequest = window.XMLHttpRequest;

    return function(opts) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', opts.url, true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE) {
          try {
            if (xhr.status == 200) {
              callbacks.done(parseResponse.call(this) );
            } else {
              callbacks.fail();
            }
          } finally {
            callbacks.always();
          }
        }
      };
      window.setTimeout(function() {
        xhr.send();
      }, 0);
      var callbacks = {
        done : function() {},
        fail : function() {},
        always : function() {}
      };
      return {
        done : function(done) { callbacks.done = done; },
        fail : function(fail) { callbacks.fail = fail; },
        always : function(always) { callbacks.always = always; }
      }
    };
  }();

  var app = {
    send : function(data) {
      ws.send(JSON.stringify(data) );
    },
    isAlive : function() {
      return alive;
    },
    actions : {
    },
    ajax : ajax
  };

  return app;
};
