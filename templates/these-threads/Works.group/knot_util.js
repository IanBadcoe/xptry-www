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

function MakeCartouche(svg, rad, drawer, decorators) {
    const steps = 60;
    const intermediate_frac = 0.5;
    const intermediate_offset = 2;
    const halves_offset = 0.9;

    let line_thick = drawer.Width;
    let end_pos = Math.asin(line_thick * 3 / rad);



    const half_knot_points = new CoordArray([
        [1, 0],
        [0, 0],
        [-intermediate_frac, -intermediate_offset],
        [-1, 0],
        [-1, halves_offset],
        [-intermediate_frac, intermediate_offset + halves_offset],
        [0, halves_offset],
        [1, halves_offset],
        [1, 3]
    ]);

    // const half_knot_points = [
    //     [end_pos, rad],
    //     [0, rad],
    //     [-end_pos * intermediate_frac, rad - intermediate_offset * line_thick],
    //     [-end_pos, rad],
    //     [-end_pos, rad + halves_offset * line_thick],
    //     [-end_pos * intermediate_frac, rad + line_thick * (intermediate_offset + halves_offset)],
    //     [0, rad + line_thick * halves_offset],
    //     [end_pos, rad + line_thick * halves_offset],
    //     [end_pos * intermediate_frac, rad + line_thick * 3]
    // ]

    let points = [];

    function push_point(vec, coord) {
        let hc = new Coord(coord.X * line_thick * 3, coord.Y * line_thick + rad);
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

    half_knot_points.slice().reverse().forEach( p => {
        push_point(points, p);
    });

    let a = end_pos * 2;
    let step = (Math.PI - end_pos * 2) * 2 / steps;

    for(let i = 0; i < steps + 1; i++)
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

    let last = points.slice(-1)[0];

    points.push(new Coord(last[0], last[1] * 1.3));

    let knot = MakeAdvCKnot(
        [{
            Drawer: drawer,
            Step: 1,
            Points: new CoordArray(points),
            Open: true,
            Order: 3,
        }],
        null, decorators
    );


    knot.Draw(svg);
}