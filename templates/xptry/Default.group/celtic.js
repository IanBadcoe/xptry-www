(
    function() {
        MakeCKnot = function(loops) {
            if (!Array.isArray(loops))
            {
                loops = [loops];
            }

            var intersects = {};

            loops.forEach(loop => {
                loop.Points.forEach(pnt => {
                    intersects[pnt] = {
                        count: 0,
                        is_over: null       // three valued logic, null = unset...
                    };
                });
            });

            loops.forEach(loop => {
                loop.Points.forEach(pnt => {
                    intersects[pnt].count++;

                    if (intersects[pnt].count > 2) {
                        throw "triple and greater intersections are not supported"
                    }
                });
            });

            var loop = loops[0];
            loops.splice(0, 1);
            var next_over = false;
            var _knots = [];

            while(loop)
            {
                if (!('Open' in loop)) {
                    loop.Open = false;
                }

                if (!('Order' in loop)) {
                    loop.Order = 3;
                }

                var anno_points = [];
                var points = [];

                loop.Points.forEach(pnt => {
                    var inter = intersects[pnt];

                    if (inter.count < 2)
                    {
                        anno_points.push({
                            over: null
                        });
                    } else {
                        anno_points.push({
                            over: next_over
                        });

                        inter.is_over = next_over;

                        next_over = !next_over;
                    }

                    points.push(pnt);
                });

                var spline = MakeParamScaler(MakeNonUniformBSpline(points, loop.Order, !loop.Open));

                var overlay_ranges = [];

                anno_points.forEach((el, idx) => {
                    if (el.over) {
                        var f = spline.Point2Param(idx - 0.5);
                        var t = spline.Point2Param(idx + 0.5);
                        overlay_ranges.push([f, t]);
                    }
                });

                _knots.push({
                    Spline: spline,
                    OverlayRanges: overlay_ranges,
                    Drawer: loop.Drawer,
                    Step: loop.Step,
                    get EndParam() {
                        return this.Spline.EndParam;
                    },
                    Interp: function(x) {
                        var hx = x;

                        while(hx > this.EndParam)
                        {
                            hx -= this.EndParam;
                        }
                        while(hx < 0)
                        {
                            hx += this.EndParam;
                        }

                        return this.Spline.Interp(hx);
                    },
                    Open: loop.Open
                });

                loop = null;

                if (loops.length == 0)
                    break;

                var found_idx = -1;

                try {
                    // find a sequence that shares an intersect with what we already have
                    loops.forEach((loop, loop_idx) => {
                        // by toggling this at each intersection with unknown state,
                        // we can back-calculate to how we have to start in order to arrive with the
                        // correct next_over when we hit on with known state
                        var invert = false;

                        loop.Points.forEach((pnt, pnt_idx) => {
                            var inter = intersects[pnt];

                            if (inter.is_over != null) {
                                found_idx = loop_idx;
                                // this will be the first intersecting element we hit, so set next_over
                                // to send it the right way
                                next_over = inter.is_over == invert;

                                throw "got one!"
                            } else if (inter.count > 1) {
                                invert = !invert;
                            }
                        });
                    });
                }
                catch (e) {
                    if (e != "got one!")
                        throw e;
                }

                if (found_idx == -1) {
                    // didn't find a connected sequence, take an unconnected one...
                    found_idx = 0;
                    // arbitrary but for consistency
                    next_over = false;
                }

                loop = loops[found_idx];
                loops.splice(found_idx, 1)
            }

            return {
                Draw: function(insert_element) {
                    _knots.forEach(knot => {
                        // knot.Drawer.BackDrawKnot(insert_element,
                        //     0, knot.EndParam, knot.Step, knot,
                        //     !knot.Open, !knot.Open);
                        knot.Drawer.ForeDrawKnot(insert_element,
                            0, knot.EndParam, knot.Step, knot,
                            !knot.Open, !knot.Open);
                    });

                    _knots.forEach(knot => {
                        knot.OverlayRanges.forEach(el => {
                            knot.Drawer.BackDrawKnot(insert_element,
                                el[0], el[1], knot.Step, knot,
                                false, !knot.Open);
                            knot.Drawer.ForeDrawKnot(insert_element,
                                el[0], el[1], knot.Step + 1, knot,
                                false, !knot.Open);
                         });
                    });
                }
            };
        }
    }
)();