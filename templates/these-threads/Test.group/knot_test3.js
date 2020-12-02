$(document).ready(function(){
    let points = [];
    const steps = 20;
    const end_pos = 0.2;
    const rad = 100;
    const knot_thick = 13;

    function push_point(vec, ang, rad) {
        if (ang < 0) {
            ang += Math.PI * 2;
        } else if (ang > Math.PI * 2) {
            ang -= Math.PI * 2;
        }
        vec.push(new Coord(Math.sin(ang) * rad, Math.cos(ang) * rad));
    }

    let half_knot_points = [
        [0, rad],
        [-end_pos / 2, rad - knot_thick],
        [-end_pos, rad],
        [-end_pos, rad + knot_thick],
        [-end_pos / 2, rad + knot_thick * 2],
        [0, rad + knot_thick],
        [end_pos, rad + knot_thick],
        [end_pos, rad * 1.5]
    ]

    half_knot_points.slice().reverse().forEach( p => {
        push_point(points, p[0], p[1]);
    });

    let a = end_pos;
    let step = (Math.PI - end_pos) * 2 / steps;

    for(let i = 0; i < steps + 1; i++)
    {
        push_point(points, a, rad);
        a += step;
    }

    half_knot_points.forEach( p => {
        push_point(points, -p[0], p[1]);
    });

    let knot = MakeAdvCKnot(
        [{
            Drawer: Drawers.home_knot,
            Step: 2,
            Points: new CoordArray(points),
            Open: true,
            Order: 3,
//            Klass: "rotating"
        }],
//        base_plate, decorators
    );

    knot.Draw($(".test-line"));
});