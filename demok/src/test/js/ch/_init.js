
describe('init', function() {

  it('intro', function(done) {
    init();
    expect(typeof 'here').toBe('string');
    done();
  });

  it('intro#1', function(done) {
    demo.init();
    demo.waitFor(done);
  });

  it('intro#2', function(done) {
    demo.init();

    var ctx = demo.ctx;
    expect(typeof ctx).toBe('object');
    ctx.fillStyle = 'red';
    ctx.fillRect(50, 50, 100, 100);

    demo.waitFor(done);
  });

});

var init = function() {

  var demo = {

    width: 200,
    height: 200,
    fgColor: '#000',
    bgColor: '#ccc',

    ctx: null,

    init: function() {

      // clear stage.
      document.body.innerHTML = '';

      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      document.body.appendChild(canvas);

      this.initCtx(canvas);

      var enterFrame = function(time) {
        if(!this.ctx) {
          console.log('stop animation.');
          this.finalize();
          return;
        }
        if (this.frameCount == 0) {
          this.startTime = time;
        }
        this.enterFrame(time);
        this.frameCount += 1;
        window.requestAnimationFrame(enterFrame);
      }.bind(this);

      console.log('start animation.');
      this.frameCount = 0;
      window.requestAnimationFrame(enterFrame);
    },
    initCtx: function(canvas) {
    },
    enterFrame: function(time) {
    },
    finalize: function() {
    },
    waitFor: function(done) {
      window.setTimeout(function() {
        this.ctx = null;
        this.finalize = function() {
          done();
        };
      }.bind(this), 500);
    },
    getInfo: function(time) {
      return 'frame#'
        + this.frameCount + '/'
        + ~~(time - this.startTime);
    },
  };

  demo.initCtx = function(canvas) {

    var width = this.width;
    var height = this.height;

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = this.fgColor;
    ctx.fillStyle = this.bgColor;

    ctx.fillRect(0, 0, width, height);

    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();

    this.ctx = ctx;

    this.enterFrame = function(time) {
      var size = 14;
      var ctx = this.ctx;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);
      ctx.font = size + 'px monospace';
      ctx.fillStyle = 'black';
      ctx.fillText(this.getInfo(time), 20, 20 + size);
    };
  };

  window.demo = demo;
};
