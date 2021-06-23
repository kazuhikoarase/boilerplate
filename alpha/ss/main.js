window.addEventListener('load', function() {
  var creElm = function(tagName) {
    return document.createElement(tagName);
  };
  var ta = document.getElementById('plain');
  ta.value.split(/\r?\n/g).forEach(function(line, row) {
    var start = 0;
    var ws = /\s/;
    var col = 0;
    for (var i = 0; i < line.length; i += 1) {
      var c = line.charAt(i);
      if (c.match(ws) ) {
        if (start != col) {
          
        }
      }
      if (line.charCodeAt(i) < 128) {
        col += 1;
      } else {
        col += 2;
      }
    }
  });
  /*
  var table = creElm('table');
  document.getElementById('result').appendChild(table);
  var tr = creElm('tr');
  table.appendChild(tr);
  var td = creElm('td');
  tr.appendChild(td);
*/

});
