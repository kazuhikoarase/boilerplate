
var svgtk = function() {

  var svgNamespace = 'http://www.w3.org/2000/svg';

  var $s = function(tagName) {
    return {
      $el:document.createElementNS(svgNamespace, tagName),
      attrs: function(attrs) {
        for (var k in attrs) {
          this.$el.setAttribute(k, '' + attrs[k]);
        }
        return this;
      },
      append: function(elm) {
        this.$el.appendChild(elm.$el);
        return this;
      }
    };
  };

  var pathBuilder = function() {
    var path = '';
    return {
      M: function(x, y) {
        path += 'M';
        path += x;
        path += ' ';
        path += y;
        return this;
      },
      L: function(x, y) {
        path += 'L';
        path += x;
        path += ' ';
        path += y;
        return this;
      },
      build: function() {
        return path;
      }
    };
  };

  var create = function(width, height, bg) {

    var svgHolder = document.createElement('div');
    document.body.appendChild(svgHolder);
    var svg = $s('svg').attrs({
      width: width + 'px', height: height + 'px', xmlns: svgNamespace });
    svgHolder.appendChild(svg.$el);
    if (bg) {
      svg.append($s('rect').attrs({
        x: 0, y: 0, width: width, height: height,
        fill: '#f0f0f0', stroke: '#00f' }));
    }

    var button = document.createElement('button');
    button.textContent = ' Download ';
    button.addEventListener('click', function() {
      var content = svgHolder.innerHTML;
      content = content.replace(/^\s+|\s+$/g, '');
      var dataURL = 'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(content);
      var a = document.createElement('a');
      a.href = dataURL;
      a.download = 'chords.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    document.body.appendChild(button);

    return svg;
  };

  return { $s: $s, pathBuilder: pathBuilder, create: create };

}();
