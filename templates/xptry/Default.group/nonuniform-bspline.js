MakeNonUniformBSpline = function(points, order, closed) {
    var _knots = null;
    var _max_knot;
    var _max_param;

    if (!closed) {
        _knots = MakeClampedKnotVector(points.length, order);
        _max_param = _max_knot = _knots[_knots.length - 1];
    } else {
        _knots = MakeCyclicKnotVector(points.length, order);
        _max_param = _knots[points.length];
        // for closed curves, we want knot range, not max_knot, but I don't want
        // to add another parameter to BPlineBasis
        //
        // at the moment subtracting knot zero isn't technically required, as knot zero is
        // always zero, but it doesn't _have_ to be and subtracting keeps us honest...
        _max_knot = _max_param - _knots[0];
    }

    var _points = points;
    var _closed = closed;
    var _order = order;

    function spline_interp(x, p, knots, k)
    {
        var ret = [];
        ret.length = p[0].length;
        ret.fill(0);

        _points.forEach(function(el, idx) {
            var f = BSplineBasis(x, idx, k, knots, _max_knot, _closed);

            var t = el.map(function(q) { return f * q; });

            ret = ret.map(function(q, i){
                return q + t[i];
            });
        });

        return ret;
    }

    return {
        get StartParam() {
            return _knots[0];
        },
        get EndParam() {
            return _max_param;
        },
        get ParamRange() {
            return this.EndParam - this.StartParam;
        },
        get Order() {
            return _order;
        },
        get NumPoints() {
            return _points.length;
        },
        get NumKnots() {
            return _knots.length;
        },
        Interp: function(p) {
            return spline_interp(p, _points, _knots, _order);
        },
        Point2Param: function(idx) {
            if (_closed) {
                return idx + 0.5 + _order / 2;
            }

            return idx / (_points.length - 1) * this.ParamRange + this.StartParam;
        }
    };
}
