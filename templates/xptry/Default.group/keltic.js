(
    function() {
        MakeKKnot = function(points, sequence) {
            var _intersects = [];

            Object.keys(points).forEach(el => {
                _intersects[el] = {
                    pnt: points[el],
                    name: el,
                    count: 0
                };
            });

            sequence.forEach(el => {
                _intersects[el].count++;

                if (_intersects[el].count > 2)
                {
                    throw "tripple and greater intersections are not supported"
                }
            });

            var next_over = false;
            var _anno_points = [];
            var _points = [];

            sequence.forEach(el => {
                var where = _intersects[el];

                if (where.count < 2)
                {
                    _anno_points.push({
                        over: null,
                        pnt: where.pnt,
                        name: el
                    });
                } else {
                    _anno_points.push({
                        over: next_over,
                        pnt: where.pnt,
                        name: el
                    });

                    next_over = !next_over;
                }

                _points.push(where.pnt);
            });

            var _spline = MakeUniformBSpline(_points, 3, true);

            var _overlay_ranges = [];

            _anno_points.forEach((el, idx) => {
                if (el.over) {
                    _overlay_ranges.push([idx - 0.5, idx + 0.5]);
                }
            });

            return {
                get StartParam() {
                    return _spline.StartParam;
                },
                get EndParam() {
                    return _spline.EndParam;
                },
                get ParamRange() {
                    return _spline.ParamRange;
                },
                get OverlayRanges() {
                    return _overlay_ranges;
                },
                Interp: function(x) {
                    var hx = x;

                    while(hx > this.EndParam)
                    {
                        hx -= this.ParamRange;
                    }
                    while(hx < this.StartParam)
                    {
                        hx += this.ParamRange;
                    }

                    return _spline.Interp(hx);
                }
            };
        }
    }
)();