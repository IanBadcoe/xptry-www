"use strict";

function MakeAdvCKnot(loops, base_plate, decorators, threshold) {
    threshold = threshold || 0.01;
    let threshold2 = threshold * threshold;

    if (!Array.isArray(loops))
    {
        loops = [loops];
    }

    let intersects = [];

    function find_intersect(pnt) {
        for(let i = 0; i < intersects.length; i++) {
            let inter = intersects[i];

            if (inter.point.Dist2(pnt) < threshold2)
            {
                return inter;
            }
        }

        return null;
    }

    loops.forEach(loop => {
        loop.Points.forEach(pnt => {
            if (!find_intersect(pnt))
            {
                intersects.push({
                    point: pnt,
                    count: 0,
                    is_over: null       // three valued logic, null = unset...
                });
            }
        });
    });

    loops.forEach(loop => {
        loop.Points.forEach(pnt => {
            let inter = find_intersect(pnt);

            inter.count++;

            if (inter.count > 2) {
                throw "triple and greater intersections are not supported"
            }
        });
    });

    let loop = loops[0];
    loops.splice(0, 1);
    let next_over = false;
    let knots = [];

    while(loop)
    {
        if (!('Open' in loop)) {
            loop.Open = false;
        }

        if (!('Order' in loop)) {
            loop.Order = 3;
        }

        let anno_points = [];
        let points = [];

        loop.Points.forEach(pnt => {
            let inter = find_intersect(pnt);

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

        let spline = MakeParamScaler(MakeNonUniformBSpline(points, loop.Order, !loop.Open));

        function find_intersection_params(idx1, idx2) {
            const thres = 0.01;

            // limits, we must find something between these...
            var idx1_s = spline.Point2Param(idx1 - 1);
            var idx1_e = spline.Point2Param(idx1 + 1);
            var idx2_s = spline.Point2Param(idx2 - 1);
            var idx2_e = spline.Point2Param(idx3 + 1);

            // current solutions
            var idx1_curr = spline.Point2Param(idx1);
            var idx2_curr = spline.Point2Param(idx2);

            // current points
            var idx1_p = spline.Interp(idx1_curr);
            var idx2_p = spline.Interp(idx2_curr);

            // current distance
            var dist2 = idx1_p.Dist2(spline.interp(idx2_curr));

            // step sizes
            var idx1_step = (idx1_e - idx1_s) * 0.1;
            var idx2_step = (idx2_e - idx2_s) * 0.1;

            while (idx1_step > thres || idx2_step > thres) {
                // try step idx1

                var moved = false;

                if (idx1_curr != idx1_e) {
                    var temp = Math.min(idx1_curr + idx1_step, idx1_e);
                    var temp_p = spline.Interp(temp);
                    var temp_d = temp_p.Dist2(idx2_p);

                    if (temp_d < dist) {
                        dist = temp_d;
                        idx1_p = temp_p;
                        idx1_curr = temp;

                        moved = true;
                    }
                }

                if (idx1_c != idx1_s) {
                    var temp = Math.max(idx1_curr - idx1_step, idx1_s);
                    var temp_p = spline.Interp(temp);
                    var temp_d = temp_p.Dist2(idx2_p);

                    if (temp_d < dist) {
                        dist = temp_d;
                        idx1_p = temp_p;
                        idx1_curr = temp;

                        moved = true;
                    }
                }


                if (idx2_curr != idx2_e) {
                    var temp = Math.min(idx2_curr + idx2_step, idx2_e);
                    var temp_p = spline.Interp(temp);
                    var temp_d = temp_p.Dist2(idx1_p);

                    if (temp_d < dist) {
                        dist = temp_d;
                        idx2_p = temp_p;
                        idx2_curr = temp;

                        moved = true;
                    }
                }

                if (idx2_c != idx2_s) {
                    var temp = Math.max(idx2_curr - idx2_step, idx2_s);
                    var temp_p = spline.Interp(temp);
                    var temp_d = temp_p.Dist2(idx1_p);

                    if (temp_d < dist) {
                        dist = temp_d;
                        idx2_p = temp_p;
                        idx2_curr = temp;

                        moved = true;
                    }
                }

                if (moved) {
                    idx1_step /= 2;
                    idx2_step /= 2;
                }
            }

            return [idx1_c, idx2_c];
        }

        let overlay_ranges = [];

        anno_points.forEach((el, idx) => {
            if (el.over) {
                let f = spline.Point2Param(idx - 0.5);
                let t = spline.Point2Param(idx + 0.5);
                overlay_ranges.push([f, t]);
            }
        });

        knots.push({
            Spline: spline,
            OverlayRanges: overlay_ranges,
            Drawer: loop.Drawer,
            Step: loop.Step,
            get EndParam() {
                return this.Spline.EndParam;
            },
            Interp(x) {
                let hx = x;

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
            Open: loop.Open,
            Klass: loop.Klass
        });

        loop = null;

        if (loops.length === 0)
            break;

        let found_idx = -1;

        try {
            // find a sequence that shares an intersect with what we already have
            loops.forEach((loop, loop_idx) => {
                // by toggling this at each intersection with unknown state,
                // we can back-calculate to how we have to start in order to arrive with the
                // correct next_over when we hit on with known state
                let invert = false;

                loop.Points.forEach((pnt, pnt_idx) => {
                    let inter = find_intersect(pnt);

                    if (inter.is_over !== null) {
                        found_idx = loop_idx;
                        // this will be the first intersecting element we hit, so set next_over
                        // to send it the right way
                        next_over = inter.is_over === invert;

                        throw "got one!"
                    } else if (inter.count > 1) {
                        invert = !invert;
                    }
                });
            });
        }
        catch (e) {
            if (e !== "got one!")
                throw e;
        }

        if (found_idx === -1) {
            // didn't find a connected sequence, take an unconnected one...
            found_idx = 0;
            // arbitrary but for consistency
            next_over = false;
        }

        loop = loops[found_idx];
        loops.splice(found_idx, 1)
    }

    return {
        Draw(insert_element) {
            if (decorators) {
                decorators.forEach(dec => dec.BackDraw(insert_element));
            }

            if (base_plate) {
                base_plate.Draw(insert_element);
            }

            knots.forEach(knot => {
                // we could, rather than drawing overlay for everything that is "over"
                // do BackDrawHere and then only do overlays for those bits of "over"
                // which are not already drawn later
                //
                // pros:
                // - fewer SVG bits
                // - less CPU
                //
                // cons:
                // - SVG bits bigger as whole knot back-drawn instead of just some overlays
                // knot.Drawer.BackDrawKnot(insert_element,
                //     0, knot.EndParam, knot.Step, knot,
                //     !knot.Open, !knot.Open, knot.Klass);
                knot.Drawer.ForeDrawKnot(insert_element,
                    0, knot.EndParam, knot.Step, knot,
                    !knot.Open, !knot.Open, knot.Klass);
            });

            knots.forEach(knot => {
                knot.OverlayRanges.forEach(el => {
                    knot.Drawer.BackDrawKnot(insert_element,
                        el[0], el[1], knot.Step, knot,
                        false, !knot.Open, knot.Klass);
                    knot.Drawer.ForeDrawKnot(insert_element,
                        el[0], el[1], knot.Step + 1, knot,
                        false, !knot.Open, knot.Klass);
                    });
            });

            if (decorators) {
                decorators.forEach(dec => dec.ForeDraw(insert_element));
            }
        }
    };
}
