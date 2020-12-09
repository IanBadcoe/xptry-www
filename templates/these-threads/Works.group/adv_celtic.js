"use strict";

function MakeAdvCKnot(loops, base_plate, decorators, threshold) {
    function find_intersection_params(idx1, idx2, spline1, spline2) {
        // generally we have scaled the spline to have a param measured roughly in pixels
        // so 1 should be fine enough
        const thres = 1;

        // limits, we must find something between these...
        var idx1_s = spline1.Point2Param(idx1 - 1);
        var idx1_e = spline1.Point2Param(idx1 + 1);
        var idx2_s = spline2.Point2Param(idx2 - 1);
        var idx2_e = spline2.Point2Param(idx2 + 1);

        // current solutions
        var idx1_curr = spline1.Point2Param(idx1);
        var idx2_curr = spline2.Point2Param(idx2);

        // current points
        var idx1_p = spline1.Interp(idx1_curr);
        var idx2_p = spline2.Interp(idx2_curr);

        // current distance
        var dist2 = idx1_p.Dist2(idx2_p);

        // step sizes
        var idx1_step = (idx1_e - idx1_s) * 0.25;
        var idx2_step = (idx2_e - idx2_s) * 0.25;

        while (idx1_step > thres || idx2_step > thres) {
            // try step idx1

            var moved = false;

            var idx1_prev = idx1_curr;
            var idx2_prev = idx2_curr;

            if (idx1_prev != idx1_e) {
                var temp = Math.min(idx1_prev + idx1_step, idx1_e);
                var temp_p = spline1.Interp(temp);
                var temp_d2 = temp_p.Dist2(idx2_p);

                if (temp_d2 < dist2) {
                    dist2 = temp_d2;
                    idx1_p = temp_p;
                    idx1_curr = temp;

                    moved = true;
                }
            }

            // checking moved means we will only try one way on the first pass, even if both ways are an improvement
            // but we cannot handle any case with >1 solution reliably anyway
            if (!moved && idx1_prev != idx1_s) {
                var temp = Math.max(idx1_prev - idx1_step, idx1_s);
                var temp_p = spline1.Interp(temp);
                var temp_d2 = temp_p.Dist2(idx2_p);

                if (temp_d2 < dist2) {
                    dist2 = temp_d2;
                    idx1_p = temp_p;
                    idx1_curr = temp;

                    moved = true;
                }
            }

            // see comment above about checking "moved"
            if (!moved && idx2_prev != idx2_e) {
                var temp = Math.min(idx2_prev + idx2_step, idx2_e);
                var temp_p = spline2.Interp(temp);
                var temp_d2 = temp_p.Dist2(idx1_p);

                if (temp_d2 < dist2) {
                    dist2 = temp_d2;
                    idx2_p = temp_p;
                    idx2_curr = temp;

                    moved = true;
                }
            }

            // see comment above about checking "moved"
            if (!moved && idx2_prev != idx2_s) {
                var temp = Math.max(idx2_prev - idx2_step, idx2_s);
                var temp_p = spline2.Interp(temp);
                var temp_d2 = temp_p.Dist2(idx1_p);

                if (temp_d2 < dist2) {
                    dist2 = temp_d2;
                    idx2_p = temp_p;
                    idx2_curr = temp;

                    moved = true;
                }
            }

            if (!moved) {
                idx1_step /= 2;
                idx2_step /= 2;
            }
        }

        return [idx1_curr, idx2_curr];
    }

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
                    over_loop: null,
                    under_loop: null,
                    over_idx: null,
                    under_idx: null,
                    // allows us to force the overlay draw to stop at a certain point
                    // even if there is no intersection (count = 1) there
                    // lets us not draw gaps around overlaid bits when they would get in the way of (for e.g.) decorator knots
                    force_under: pnt.force_under
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

    let new_loops = [];

    while(loop)
    {
        if (!('Open' in loop)) {
            loop.Open = false;
        }

        if (!('Order' in loop)) {
            loop.Order = 3;
        }

        let points = [];

        loop.Points.forEach((pnt, idx) => {
            let inter = find_intersect(pnt);

            if (inter.count > 1)
            {
                if (next_over) {
                    if (inter.over_loop) {
                        throw "Two things going over!";
                    }

                    inter.over_loop = loop;
                    inter.over_idx = idx;
                } else {
                    if (inter.under_loop) {
                        throw "Two things going under!";
                    }

                    inter.under_loop = loop;
                    inter.under_idx = idx;
                }

                next_over = !next_over;
            }

            points.push(pnt);
        });

        let spline = MakeParamScaler(MakeNonUniformBSpline(points, loop.Order, !loop.Open));

        loop.Spline = spline;
        loop.NextOver = next_over;

        new_loops.push(loop);

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

    intersects.forEach(inter => {
        if (inter.count > 1)
        {
            let params = find_intersection_params(inter.over_idx, inter.under_idx,
                inter.over_loop.Spline, inter.under_loop.Spline);

            inter.over_param = params[0];
            inter.under_param = params[1];
        }
    });

    new_loops.forEach(loop => {
        let anno_points = [];

        loop.Points.forEach((pnt, idx) => {
            let inter = find_intersect(pnt);

            if (inter.count > 1)
            {
                if (inter.over_loop === loop && inter.over_idx == idx) {
                    anno_points.push({
                        over: true,
                        param: inter.over_param,
                    });
                } else {
                    if (inter.under_loop != loop || inter.under_idx != idx)
                        throw "badly constucted intersection?";

                    anno_points.push({
                        over: false,
                        param: inter.under_param,
                    });
                }
            } else if (inter.force_under) {
                anno_points.push({
                    over: false,
                    param: loop.Spline.Point2Param(idx),
                });
            }
        });

        if (loop.Open) {
            anno_points.push({
                over: false,
                param: 0,
            });
            anno_points.push({
                over: false,
                param: loop.Spline.EndParam,
            });
        }

        anno_points.sort((x, y) => x.param - y.param);

        if (!loop.Open) {
            // end with a repeat of the start entry, only wrapped round off the end of the param range
            // so that averaging with it will work correctly
            anno_points.push({
                over: anno_points[0].over,
                param: anno_points[0].param + loop.Spline.EndParam
            });
        }

        let overlay_ranges = [];

        anno_points.forEach((el, idx) => {
            if (el.over) {
                let prev = anno_points[idx - 1];
                let next = anno_points[idx + 1];
                let f = (el.param + prev.param) / 2;
                let t = (el.param + next.param) / 2;
                overlay_ranges.push([f, t]);
            }
        });

        knots.push({
            Spline: loop.Spline,
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
    });

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
