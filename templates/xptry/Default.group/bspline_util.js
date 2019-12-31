// for open curves, max_knot lets us detect the final non-empty interval and include the final
// point in it

// for closed curves, max_knot lets us push parameter values that fall before the current basis
// up by one cycle, in case they need to wrap around:
//              ___________________
//             /                   \
// p -----x--------> max_knot --y-----------> max_knot + order
// e.g. in that diagram x (falling before the curve) wraps to y (falling in the part of the curve
// that's off the end of the range) allowing the final curve to look like:
//   _______    _______
//          \  /
// p -----x--------> max_knot

function BSplineBasis(x, i, k, knots, max_knot, closed) {
    function f(x, i, k, knots, max_knot) {
            if (i + 1 >= knots.length)
            throw "bad knot index";

        const prev_k = knots[i];
        const next_k = knots[i + 1];

        if (k == 0) {
            // always test for <= at lower bound
            if (prev_k > x) {
                return 0;
            }

            if (prev_k != max_knot && next_k == max_knot) {
                // for open curves (max_knot should be -1 for closed curves...)
                //
                // if we are the last, non-empty interval allow the upper bound to
                // lie in the interval (otherwise we can never quite reach the end of the curve
                // because x == max_knot lies inside no knot interval)
                //
                // (BUT DON'T do this anywhere else, because we'd get p > 1 at max_knot)
                if (x <= next_k)
                {
                    return 1;
                }
            } else if (x < next_k) {
                return 1;
            }

            return 0;
        }

        var ret = 0;

        var left_div = knots[i + k] - prev_k;
        if (left_div) {
            var left_recurse = f(x, i, k - 1, knots, max_knot);
            if (left_recurse) {
                ret += (x - prev_k) / left_div * left_recurse;
            }
        }

        var right_div = knots[i + k + 1] - next_k;
        if (right_div) {
            var right_recurse = f(x, i + 1, k - 1, knots, max_knot);
            if (right_recurse) {
                ret += (knots[i + k + 1] - x) / right_div * right_recurse;
            }
        }

        return  ret;
    }

    if (closed) {
        if (x < knots[i])
        {
            return f(x + max_knot, i, k, knots, -1);
        }

        return f(x, i, k, knots, -1);
    }

    return f(x, i, k, knots, max_knot);
}

function MakeClampedKnotVector(num_points, order) {
    var num_knots = num_points + 1 + order;

    var ret = [];

    for(var i = 0; i < order + 1; i++) {
        ret.push(0);
    }

    for(var i = 1; i < num_points - order; i++) {
        ret.push(i);
    }

    for(var i = 0; i < order + 1; i++) {
        ret.push(num_points - order);
    }

    return ret;
}

function MakeCyclicKnotVector(num_points, order) {
    return Array.from(Array(num_points + order + 1).keys());
}

