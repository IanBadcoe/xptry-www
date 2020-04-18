(
    function() {
        MakeBasisView = function(knots, order, width, height, yoffset, closed) {
            let _closed = closed;

            let _knots = [].concat(
                knots
            );

            let _order = order;

            let _width = width;
            let _height = height;
            let _yoffset = yoffset;

            let _max_param = _knots[_knots.length - 1];
            let _max_knot = _knots[knots.length - 1];

            if (closed) {
                _max_param = _knots[_knots.length - order - 1];
                // for closed curves, we want knot range, not max_knot, but I don't want
                // to add another parameter to BSplineBasis
                _max_knot = _max_param - _knots[0];
            }

            function spline_interp(x, knots, k, idx)
            {
                return BSplineBasis(x, idx, k, knots, _max_knot, _closed);
            }

            return {
                get EndParam() {
                    return _max_param;
                },
                get Order() {
                    return _order;
                },
                Interp(p) {
                    let x = p / this.EndParam * width;
                    return [x, _yoffset - spline_interp(p, _knots, _order, this.idx) * height];
                },
                SetIdx(idx) { this.idx = idx; },
                get NumBases() {
                    return _knots.length - 1 - _order;
                },
                get YOffset() {
                    return _yoffset;
                }
            };
        }
    }
)();
