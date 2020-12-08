$(document).ready(function() {
    var start = new Date().getTime();

    let points = [];

    function push_point(vec, ang, rad) {
        if (ang < 0) {
            ang += Math.PI * 2;
        } else if (ang > Math.PI * 2) {
            ang -= Math.PI * 2;
        }
        vec.push(new Coord(Math.sin(ang) * rad, Math.cos(ang) * rad));
    }

    const steps = 20;
    const end_pos = 0.3;
    const rad = 100;
    const line_thick = 20;
    const intermediate_frac = 0.5;
    const intermediate_offset = 1;
    const halves_offset = 0.45;

    let half_knot_points = [
        [end_pos, rad],
        [0, rad],
        [-end_pos * intermediate_frac, rad - intermediate_offset * line_thick],
        [-end_pos, rad],
        [-end_pos, rad + halves_offset * line_thick],
        [-end_pos * intermediate_frac, rad + line_thick * (intermediate_offset + halves_offset)],
        [0, rad + line_thick * halves_offset],
        [end_pos, rad + line_thick * halves_offset],
        [end_pos * intermediate_frac, rad + line_thick * 3]
    ]

    half_knot_points.slice().reverse().forEach( p => {
        push_point(points, p[0], p[1]);
    });

    let a = end_pos * 2;
    let step = (Math.PI - end_pos * 2) * 2 / steps;

    for(let i = 0; i < steps + 1; i++)
    {
        push_point(points, a, rad);
        a += step;
    }

    half_knot_points.forEach( p => {
        push_point(points, -p[0], p[1]);
    });

    let last = points.slice(-1)[0];

    points.push(new Coord(last[0], last[1] * 1.3));

    let knot = MakeAdvCKnot(
        [{
            Drawer: Drawers.cartouche1,
            Step: 2,
            Points: new CoordArray(points),
            Open: true,
            Order: 3,
        }]
    );

    knot.Draw($(".test-line"));

    console.log(new Date().getTime() - start + " ms");
});