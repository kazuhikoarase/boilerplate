
var console = {
  log: function(msg) { $console.log('' + msg); },
  error: function(msg) { $console.error('' + msg); }
};

var alert, confirm, input;
!function() {
  var Util = Packages.httpproxy.core.Util;
  var optsToJavaMap = function(opts) {
    opts = opts || {};
    var map = Util.map([]);
    for (var k in opts) {
      map.put(k, opts[k]);
    }
    return map;
  };
  alert = function(msg, opts) {
    Util.alert(msg, optsToJavaMap(opts) );
  };
  confirm = function(msg, opts) {
    return !!Util.confirm(msg, optsToJavaMap(opts) );
  };
  input = function(msg, opts) {
    var input = Util.input(msg, optsToJavaMap(opts) );
    return input != null? '' + input : null;
  };
}();

var init = function(config) {

  var EventListener = Packages.httpproxy.event.EventListener;

  //setup config
  for (var k in config) {
    $config.put(k, config[k]);
  }
  // setup events
  if (config.on) {
    for (var k in config.on) {
      $eventTarget.on(k, new EventListener({
        handle : config.on[k]
      }));
    }
  }
};

init({
  // service port
  port: 8080,
  // enable network emulation
  enableNetEmu: true,
  // bps for slow network emulation
  bps: 100 * 1024 * 1024,
  on: {
    beginsession: function(event) {
      var detail = event.getDetail();
      var requestHeader = detail.get('requestHeader');
      var startLine = '' + requestHeader.getStartLine();
      var tokens = startLine.split(/\u0020/g);
      var url = tokens[1].match(/^([^\?]+)(\?.*)?$/);
      if (url) {
        var file = url[1];
        var search = url[2];
      }
      detail.put('enableLog', true);
    },
    getproxy: function(event) {
      var detail = event.getDetail();
      var console = detail.get('console');
      detail.put('proxy', 'DIRECT');
    },
    beforeproxyrequest: function(event) {
      var detail = event.getDetail();
      var console = detail.get('console');
    },
    beforeproxyresponse: function(event) {
      var detail = event.getDetail();
      var console = detail.get('console');
      var responseHeader = detail.get('responseHeader');
      var cookies = responseHeader.getHeaderValues('set-cookie');
      for (var i = 0; i < cookies.length; i += 1) {
        var cookie = cookies[i].match(/^([^=;]+)=([^=;]*)(;.*)?$/);
        if (cookie) {
          var name = cookie[1];
          var value = cookie[2];
        }
      }
    }
  }
});
