$(document).ready(function(){
    let points = [];
    const aStep = 0.3;

    for(let a = 0; a < Math.PI * 2; a += aStep)
    {
        points.push(new Coord(Math.sin(a) * 100, Math.cos(a) * 100));
    }

    let knot = MakeAdvCKnot(
        [{
            Drawer: Drawers.home_knot,
            Step: 2,
            Points: points,
            Open: true,
            Order: 3,
//            Klass: "rotating"
        }],
//        base_plate, decorators
    );

    knot.Draw($(".test-line"));
});