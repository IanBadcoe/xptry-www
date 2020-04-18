"use strict";

var MakeNonUniformBSpline = function(points, order, closed) {
    let _knots = null;
    let _max_knot;
    let _max_param;

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

    let _points = points;
    let _closed = closed;
    let _order = order;

    function spline_interp(x, p, knots, k)
    {
        let ret = [];
        ret.length = p[0].length;
        ret.fill(0);

        _points.forEach(function(el, idx) {
            let f = BSplineBasis(x, idx, k, knots, _max_knot, _closed);

            let t = el.map(function(q) { return f * q; });

            ret = ret.map(function(q, i){
                return q + t[i];
            });
        });

        return ret;
    }

    // numbers determined empirically using maxima test page
    function point2param_open(idx) {
        let patterns;

        if (idx >= _points.length) {
            idx = _points.lenght -1;
        } else if (idx < 0) {
            idx = 0;
        }

        let iidx = Math.floor(idx);
        let fidx = idx - iidx;

        switch(_order) {
            case 1:
                return idx;

            case 2:
                patterns = {
                    4: [ 2/3, 2/3, 2/3 ],
                    other: [ 2/3, 0.833 ],
                };

                break;

            case 3:
                patterns = {
                    4: [ 1/3, 1/3, 1/3 ],
                    5: [ .453, .547, .547, .453 ],
                    6: [ .453, .655, .784, .655, .655 ],
                    7: [ .453, .655, .891, .891, .655, .453 ],
                    other: [ .453, .655, .891 ]
                };

                break;

            default:
                throw "unsupported order: " + _order + " in point2param";
        }

        let ret = 0;

        // the first few and last few increments come from seq (where the empty intervals distort the basis
        // curves) otherwise the spacing is 1
        function get_increment(i, seq) {
            if (i < seq.length) {
                return seq[i];
            }

            let rev_idx = points.length - i - 1;

            if (rev_idx < seq.length) {
                return seq[rev_idx];
            }

            return 1;
        }

        let seq;

        if (points.length in patterns) {
            seq = patterns[points.length];

            for(let i = 0; i < idx; i++) {
                ret += seq[i]
            }
        } else {
            seq = patterns['other'];

            for (let i = 0; i < iidx; i++) {
                ret += get_increment(i, seq);
            }
        }

        if (fidx > 0) {
            ret += fidx * get_increment(iidx, seq);
        }

        return ret;
    }

    return {
        get EndParam() {
            return _max_param;
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
        Interp(p) {
            return spline_interp(p, _points, _knots, _order);
        },
        Point2Param(idx) {
            if (_closed) {
                return idx + 0.5 + _order / 2;
            }

            return point2param_open(idx);
        }
    };
}
