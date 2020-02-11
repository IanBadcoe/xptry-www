// we may not reach outer_rad, but that's where a next layer would go...
function make_template_knot_radial(tile,
    centre, inner_rad, outer_rad, repeats,
    base_plate, decorators,
    drawer) {
    let points = [];

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

