(
    function() {
        MakeUniformBSpline = function(points, order) {
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
