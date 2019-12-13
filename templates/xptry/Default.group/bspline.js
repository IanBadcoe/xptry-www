(
    function() {
        MakeSpline = function(points, order) {
            var _here_points = [].concat(
                Array(order).fill(points[0]),
                points,
                Array(order).fill(points.slice(-1)[0])
            );

            var _orig_size = points.length;

            var _orig_points = points;

            var _order = order;

            function B(x, i, k) {
                if (k == 0) {
                    if (x >= i && x < i + 1)
                    {
                        return 1;
                    }

                    return 0;
                }

                return (x - i) / k * B(x, i, k - 1)
                    + (i + k + 1 - x) / k * B(x, i + 1, k - 1);
            }

            function spline_interp(x, p, k)
            {
                var ret = [];
                ret.length = p[0].length;
                ret.fill(0);

                var hx = x + k;

                _here_points.forEach(function(el, idx) {
                    var f = B(hx, idx, k);

                    var t = el.map(function(q) { return f * q; });

                    ret = ret.map(function(q, i){
                        return q + t[i];
                    });
                });

                return ret;
            }

            return {
                get StartParam() {
                    return 1;
                },
                get EndParam() {
                    return _orig_size + _order - 1;
                },
                get Order() {
                    return _order;
                },
                get Points() {
                    return _orig_points;
                },
                Interp: function(p) {
                    return spline_interp(p, _here_points, _order);
                }
            };
        }
    }
)();

// $(document).ready(function(){
// //  var points = [
// //      [250, 250],
// //      [450, 250],
// //      [450, 450],
// //      [ 50, 450],
// //      [ 50,  50],
// //  ];

//   var points = [
//       [100],
//       [500],
//       [200],
//       [300],
//       [100],
//   ];

//   var lp = null;

//   spline = MakeSpline(points, 3);

//   for(p = spline.StartParam; p < spline.EndParam; p += 0.1) {
//   	var c = spline.Interp(p);
//     var cp = [(p + 3) * 50, c];

//     if (lp) {
//       add_line($(".test-line"), cp, lp, 'stroke:rgb(255,0,0);stroke-width:2');
//     }

//     lp = cp;
//   }

//   add_line($(".test-line"), [ 50, 0], [ 50, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [100, 0], [100, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [150, 0], [150, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [200, 0], [200, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [250, 0], [250, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [300, 0], [300, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [350, 0], [350, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [400, 0], [400, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [450, 0], [450, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [500, 0], [500, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [550, 0], [550, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [600, 0], [600, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [650, 0], [650, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [700, 0], [700, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [750, 0], [750, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [800, 0], [800, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [850, 0], [850, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//   add_line($(".test-line"), [900, 0], [900, 500], 'stroke:rgb(0,0,255);stroke-width:2');
// });
