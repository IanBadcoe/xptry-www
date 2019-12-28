(
    function() {
        MakeCKnot = function(loops) {
            if (!Array.isArray(loops))
            {
                loops = [loops];
            }

            var intersects = [];

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

                var spline = MakeUniformBSpline(points, 3, true);

                var overlay_ranges = [];

                anno_points.forEach((el, idx) => {
                    if (el.over) {
                        // we index from zero, the spline starts from StartParam
                        // and there's another +1 here because points actually appear at the _end_ of there range...
                        overlay_ranges.push([idx + spline.StartParam + 0.5, idx + spline.StartParam + 1.5]);
                    }
                });

                _knots.push({
                    Spline: spline,
                    OverlayRanges: overlay_ranges,
                    Drawer: loop.Drawer,
                    Divide: loop.Divide,
                    get StartParam() {
                        return this.Spline.StartParam;
                    },
                    get EndParam() {
                        return this.Spline.EndParam;
                    },
                    get ParamRange() {
                        return this.Spline.ParamRange;
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

                        return this.Spline.Interp(hx);
                    }
                });

                loop = null;

                if (loops.length == 0)
                    break;

                var found_idx = -1;
                var start_el = -1;

                try {
                    // find a sequence that shares an intersect with what we already have
                    loops.forEach((loop, loop_idx) => {
                        loop.Points.forEach((pnt, pnt_idx) => {
                            var inter = intersects[pnt];

                            if (inter.is_over != null) {
                                found_idx = loop_idx;
                                // this will be the first intersecting element we hit, so set next_over
                                // to send it the right way
                                next_over = !inter.is_over;
                                start_el = pnt_idx;

                                throw "got one!"
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

                // to make it the first intersect we hit, we first have to move it first
                // otherwise we could hit one from some other loop that we didn't process yet...
                if (start_el != -1) {
                    loop.Points = [].concat(
                        loop.Points.slice(start_el),
                        loop.Points.slice(0, start_el)
                    );
                }
            }

            return {
                Draw: function(insert_element) {
                    _knots.forEach(knot => {
                        knot.Drawer.ForeDrawKnot(insert_element,
                            knot.StartParam, knot.EndParam, knot.Divide, knot,
                            true);
                    });

                    _knots.forEach(knot => {
                        knot.OverlayRanges.forEach(el => {
                            knot.Drawer.BackDrawKnot(insert_element,
                                el[0], el[1], knot.Divide, knot,
                                false);
                            knot.Drawer.ForeDrawKnot(insert_element,
                                el[0], el[1], knot.Divide + 1, knot,
                                false);
                         });
                    });
                }
            };
        }
    }
)();