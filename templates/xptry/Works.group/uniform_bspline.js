(
    function() {
        MakeUniformBSpline = function(points, order, closed) {
            let _here_points;

            if (!closed) {
                _here_points = [].concat(
                    Array(order).fill(points[0]),
                    points,
                    Array(order).fill(points.slice(-1)[0])
                );
            } else {
                _here_points = [].concat(
                    points.slice(-order),
                    points,
                    points.slice(0, order)
                );
            }

            let _orig_size = points.length;

            let _orig_points = points;

            let _order = order;

            let _closed = closed;

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
                let ret = [];
                ret.length = p[0].length;
                ret.fill(0);

                let hx = x + k;

                _here_points.forEach(function(el, idx) {
                    let f = B(hx, idx, k);

                    let t = el.map(function(q) { return f * q; });

                    ret = ret.map(function(q, i){
                        return q + t[i];
                    });
                });

                return ret;
            }

            return {
                get EndParam() {
                    return _orig_size + 1;
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
