"use strict";

function MakeAdvCKnot(loops, base_plate, decorators) {
    let _base_plate = base_plate;
    let _decorators = decorators;

    if (!Array.isArray(loops))
    {
        loops = [loops];
    }

    let intersects = {};

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

    let loop = loops[0];
    loops.splice(0, 1);
    let next_over = false;
    let _knots = [];

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
            let inter = intersects[pnt];

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

        let overlay_ranges = [];

        anno_points.forEach((el, idx) => {
            if (el.over) {
                let f = spline.Point2Param(idx - 0.5);
                let t = spline.Point2Param(idx + 0.5);
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
                    let inter = intersects[pnt];

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
            if (_decorators) {
                _decorators.forEach(dec => dec.BackDraw(insert_element));
            }

            if (_base_plate) {
                _base_plate.Draw(insert_element);
            }

            _knots.forEach(knot => {
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
                knot.Drawer.ForeDrawKnot(insert_element,
                    0, knot.EndParam, knot.Step, knot,
                    !knot.Open, !knot.Open, knot.Klass);
            });

            _knots.forEach(knot => {
                knot.OverlayRanges.forEach(el => {
                    knot.Drawer.BackDrawKnot(insert_element,
                        el[0], el[1], knot.Step, knot,
                        false, !knot.Open, knot.Klass);
                    knot.Drawer.ForeDrawKnot(insert_element,
                        el[0], el[1], knot.Step + 1, knot,
                        false, !knot.Open, knot.Klass);
                    });
            });

            if (_decorators) {
                _decorators.forEach(dec => dec.ForeDraw(insert_element));
            }
        }
    };
}
