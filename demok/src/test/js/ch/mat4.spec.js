
var mat4 = require('./mat4.js');

describe('mat4', function() {

  it('basic', function() {

    var mat, vec;

    mat = mat4();

    expect(mat.length).toBe(16);

    vec = mat.transform([3, 2, 5, 1]);
    expect(vec).toEqual([3, 2, 5, 1]);
    vec = mat4().translateX(1).transform(vec);
    expect(vec).toEqual([4, 2, 5, 1]);
    vec = mat4().translateY(1).transform(vec);
    expect(vec).toEqual([4, 3, 5, 1]);
    vec = mat4().translateZ(1).transform(vec);
    expect(vec).toEqual([4, 3, 6, 1]);
    vec = mat4().translate({ x: -2, y: -1, z: -4 }).transform(vec);
    expect(vec).toEqual([2, 2, 2, 1]);

    vec = mat4().scale(4).transform(vec);
    expect(vec).toEqual([8, 8, 8, 1]);
    vec = mat4().scaleX(.5).transform(vec);
    expect(vec).toEqual([4, 8, 8, 1]);
    vec = mat4().scaleY(.5).transform(vec);
    expect(vec).toEqual([4, 4, 8, 1]);
    vec = mat4().scaleZ(.5).transform(vec);
    expect(vec).toEqual([4, 4, 4, 1]);

    var round = function(a) {
      return a.map(function(v) {
        v = Math.round(v);
        if (v === -0) {
          v = 0;
        }
        return v;
      });
    };

    vec = mat4().rotateX(Math.PI / 2).transform([4, 4, 4, 1]);
    vec = round(vec);
    expect(vec).toEqual([4, -4, 4, 1]);
    vec = mat4().rotateY(Math.PI / 2).transform([4, 4, 4, 1]);
    vec = round(vec);
    expect(vec).toEqual([4, 4, -4, 1]);
    vec = mat4().rotateZ(Math.PI / 2).transform([4, 4, 4, 1]);
    vec = round(vec);
    expect(vec).toEqual([-4, 4, 4, 1]);

    var a = mat4()
      .translateX(8)
      .translateY(2)
      .translateZ(4)
      .rotateX(Math.PI / 2)
      .rotateY(-Math.PI / 2)
      .rotateZ(Math.PI)
      .scale(2);
    a = mat4(round(a) );
    expect(a.invert().invert() ).toEqual(a);

  });
});
