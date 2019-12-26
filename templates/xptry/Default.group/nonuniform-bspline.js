(
    function() {
        MakeNonUniformBSplineCombined = function(points, order) {
            var _points = [];
            var _knots = [];
            var _param = 1;

            points.forEach(function(x) {
                _points.push(x.pnt);
                _knots.push(_param);
                _param += x.par;
            });

            return MakeNonUniformBSpline(_points, _knots, order);
        }

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
                get ParamRange() {
                    return this.EndParam - this.StartParam;
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
