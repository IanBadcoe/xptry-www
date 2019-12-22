(
    function() {
        MakeNonUniformBSpline = function(points, knots, order) {
            var _here_points = [].concat(
                Array(order).fill(points[0]),
                points,
                Array(order).fill(points.slice(-1)[0])
            );

            var _here_knots = [].concat(
                Array(order).fill(knots[0]),
                knots,
                Array(order).fill(knots.slice(-1)[0])
            );

            var _orig_size = points.length;

            var _orig_points = points;
            var _orig_knots = knots;

            var _order = order;

            function B(x, i, k, knots) {
                if (k == 0) {
                    if (x >= knots[i] && x <= knots[i + 1])
                    {
                        return 1;
                    }

                    return 0;
                }

                var ret = 0;

                var left_recurse = B(x, i, k - 1, knots);
                if (left_recurse) {
                    var left_div = knots[i + k] - knots[i];
                    if (left_div) {
                        ret += (x - knots[i]) / left_div * left_recurse;
                    }
                }

                var right_recurse = B(x, i + 1, k - 1, knots);
                if (right_recurse) {
                    var right_div = knots[i + k + 1] - knots[i + 1];
                    if (right_div) {
                        ret += (knots[i + k + 1] - x) / right_div * right_recurse;
                    }
                }

                return  ret;
            }

            function spline_interp(x, p, knots, k)
            {
                var ret = [];
                ret.length = p[0].length;
                ret.fill(0);

                _here_points.forEach(function(el, idx) {
                    var f = B(x, idx, k, knots);

                    var t = el.map(function(q) { return f * q; });

                    ret = ret.map(function(q, i){
                        return q + t[i];
                    });
                });

                return ret;
            }

            return {
                get StartParam() {
                    return _orig_knots[1];
                },
                get EndParam() {
                    return _orig_knots.slice(-1)[0];
                },
                get Order() {
                    return _order;
                },
                get Points() {
                    return _orig_points;
                },
                get Knots() {
                    return _orig_knots;
                },
                Interp: function(p) {
                    return spline_interp(p, _here_points, _here_knots, _order);
                },
                Basis: function(p, i) {
                    return B(p, i, _order, _here_knots);
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

//     var points = [
//         [100],
//         [500],
//         [200],
//         [300],
//         [100],
//     ];

//     var knots = [
//         1,
//         2,
//         3,
//         4,
//         5,
//         6
//     ];

//     add_line($(".test-line"), [ 50, 0], [ 50, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [100, 0], [100, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [150, 0], [150, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [200, 0], [200, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [250, 0], [250, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [300, 0], [300, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [350, 0], [350, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [400, 0], [400, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [450, 0], [450, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [500, 0], [500, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [550, 0], [550, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [600, 0], [600, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [650, 0], [650, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [700, 0], [700, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [750, 0], [750, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [800, 0], [800, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [850, 0], [850, 500], 'stroke:rgb(0,0,255);stroke-width:2');
//     add_line($(".test-line"), [900, 0], [900, 500], 'stroke:rgb(0,0,255);stroke-width:2');

//     var lp = null;

//     spline = MakeNonUniformBSpline(points, knots, 2);

//     for(p = spline.StartParam - 0.5; p < spline.EndParam + 0.5; p += 0.01) {
//         var hp = p;
//         // if (p > spline.EndParam)
//         // {
//         //     hp = spline.EndParam;
//         // }
//         var c = spline.Interp(hp);
//         var cp = [hp * 50, c];

//         if (lp) {
//             add_line($(".test-line"), cp, lp, 'stroke:rgb(255,0,0);stroke-width:2');
//         }

//         lp = cp;
//     }
// });
