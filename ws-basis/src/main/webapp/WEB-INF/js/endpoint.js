//
// endpoint.js
//

var System = Packages.java.lang.System;

var console = {
  log : function() {
    var msg = '';
    for (var i = 0; i < arguments.length; i += 1) {
      if (i > 0) {
        msg += ' ';
      }
      msg += '' + arguments[i];
    }
    System.out.println(msg);
  }
};

console.log('session start');

var onMessage = function(message) {
  console.log('onMessage:' + message);
  var data = JSON.parse(message);
  data.sid = session.getId();
  data.date = getTime();
  if (data.action && actions[data.action]) {
    actions[data.action](data);
  }
};

var send = function(data, sid) {
  sessionManager.sendText(sid || session.getId(), JSON.stringify(data) );
};

var sendForAll = function(data) {
  var sids = sessionManager.getAllSids();
  for (var i = 0; i < sids.length; i += 1) {
    var userData = getUserData(sids[i]);
    if (userData.user) {
      send(data, sids[i]);
    }
  }
};

var getUserData = function(sid) {
  var data = sessionManager.get(sid).getData();
  return data? JSON.parse(data) : {};
};

var setUserData = function(sid, userData) {
  sessionManager.get(sid).setData(JSON.stringify(userData || {}) );
};

var tran = function(callback) {
  var conn = dataSource.getConnection();
  try {
    conn.setAutoCommit(false);
    return callback(conn);
  } finally {
    conn.rollback();
    conn.close();
  }
};

var putData = function(data) {
  var dataGrp = 'DFLT';
  var update1 = function(conn, dataId) {
    var stmt = conn.prepareStatement(
      'update CLB_DATA_ID_TBL set DATA_ID=? where DATA_GRP=?');
    try {
      stmt.setLong(1, dataId);
      stmt.setString(2, dataGrp);
      stmt.executeUpdate();
    } finally {
      stmt.close();
    }
  };
  var update2 = function(conn, dataId) {
    var stmt = conn.prepareStatement(
      'insert into CLB_DATA_TBL' +
      ' (DATA_GRP,DATA_ID,ATTR1,ATTR2,ATTR3,ATTR4,JSON_DATA)' +
      ' values (?,?,?,?,?,?,?)');
    try {
      stmt.setString(1, dataGrp);
      stmt.setLong(2, dataId);
      stmt.setString(3, '');
      stmt.setString(4, '');
      stmt.setString(5, '');
      stmt.setString(6, '');
      stmt.setString(7, JSON.stringify(data) );
      stmt.executeUpdate();
    } finally {
      stmt.close();
    }
  };
  return tran(function(conn) {
    var stmt = conn.prepareStatement(
        'select DATA_ID from CLB_DATA_ID_TBL where DATA_GRP=? for update');
    try {
      stmt.setString(1, dataGrp);
      var rs = stmt.executeQuery();
      try {
        if (rs.next() ) {
          var dataId = rs.getLong(1) + 1;
          data.dataId = dataId;
          update1(conn, dataId);
          update2(conn, dataId)
          conn.commit();
          return dataId;
        } else {
          throw '!';
        }
      } finally {
        rs.close();
      }
    } finally {
      stmt.close();
    }
  });
};

var getTime = function() {
  return +System.currentTimeMillis();
};

//

var actions = {};

actions.login = function(data) {
  setUserData(session.getId(), { user : data.user });
  data.logined = true;
  send(data);
};

actions.broadcast = function(data) {
  sendForAll(data);
};

actions.putData = function(data) {
  putData(data.data);
  sendForAll(data);
};

