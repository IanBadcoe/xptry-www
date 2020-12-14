"use strict";

// we may not reach outer_rad, but that's where a next layer would go...
function MakeTemplateKnotRadial(tile,
    centre, inner_rad, outer_rad, repeats,
    base_plate, decorators,
    drawer) {
    let points = new CoordArray();

    const num_angles = tile.Width * repeats;
    const ang_step = 2 * Math.PI / num_angles;
    let rad_step = (outer_rad - inner_rad) / tile.Height;

    function transform_point(pnt, base_ang_idx) {
        let ang_idx = base_ang_idx + pnt[0];

        if (ang_idx > num_angles) {
            ang_idx -= num_angles;
        }

        let rad = inner_rad + pnt[1] * rad_step;

        return [ centre[0] + rad * Math.sin(ang_idx * ang_step),
                    centre[1] + rad * -Math.cos(ang_idx * ang_step) ];
    }

    for(let base_ang_idx = 0; base_ang_idx < num_angles; base_ang_idx += tile.Width )
    {
        tile.Pnts.forEach(pnt => {
            points.push(transform_point(pnt, base_ang_idx));
        });
    }

    return MakeAdvCKnot(
        [{
            Drawer: drawer,
            Step: 2,
            Points: points,
            Open: false,
            Order: 3,
            Klass: "rotating"
        }],
        base_plate, decorators
    );
}

function MakeCartouche(svg, rad, drawer, decorators, left_dangle, right_dangle) {
    const steps = 15;
    const intermediate_frac = 0.5;
    const intermediate_offset_up = 1.8;
    const intermediate_offset_down = 1.7;
    const circularity_offset = 0.2;
    const halves_offset = 0.7;
    const knot_width = 2.5;

    let line_thick = drawer.FullWidth;
    let end_pos = Math.asin(line_thick * knot_width / rad);


    // x is distance across the ends of the circle, measured -1 -> 0 -> 1 (left, centre, right)
    // y is up down offset measured in line_thick
    const half_knot_points = new CoordArray([
        [1, 0],
        [0, circularity_offset],
        [-intermediate_frac, -intermediate_offset_up + circularity_offset],
        [-1, 0],
        [-1, halves_offset + circularity_offset],
        [-intermediate_frac, intermediate_offset_down + halves_offset + circularity_offset],
        [0, halves_offset + circularity_offset],
        [1, halves_offset + circularity_offset],
        [1, 2.5]
    ]);

    let points = [];

    let red_rad = rad * Math.cos(end_pos);

    function push_point(vec, coord) {
        let hc = new Coord(coord.X * line_thick * knot_width, coord.Y * line_thick + red_rad);
        vec.push(hc);
    }

    function push_point_polar(vec, ang, rad) {
        if (ang < 0) {
            ang += Math.PI * 2;
        } else if (ang > Math.PI * 2) {
            ang -= Math.PI * 2;
        }
        vec.push(new Coord(Math.sin(ang) * rad, Math.cos(ang) * rad));
    }

    let backwards = half_knot_points.slice().reverse();

    backwards.forEach( p => {
        push_point(points, p);
    });

    // skip 2 steps either end as the half-knots supply the very end positions
    // and use quite a low number of points, and we get a corner if the highly-sampled circle runs straight in
    let step = (Math.PI - end_pos) * 2 / (steps + 4);
    let a = end_pos + step * 2;

    for(let i = 0; i <= steps; i++)
    {
        push_point_polar(points, a, rad);

        if (i === 1 || i === steps - 2) {
            points[points.length - 1].force_under = true;
        }

        a += step;
    }

    half_knot_points.forEach( p => {
        push_point(points, p.MirrorX());
    });

    if (right_dangle) {
        let first = new Coord(points[0]);
        first.Y += right_dangle

        points.splice(0, 0, first);
    }


    if (left_dangle) {
        let last = new Coord(points[points.length - 1]);
        last.Y += left_dangle;

        points.push(last);
    }

    let knot = MakeAdvCKnot(
        [{
            Drawer: drawer,
            Step: 5,
            Points: new CoordArray(points),
            Open: true,
            Order: 3,
        }],
        null, decorators
    );

    knot.Draw(svg);
}