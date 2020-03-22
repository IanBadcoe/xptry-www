$(document).ready(function(){
    let knot_tile = {
        Width: 6,       // column 6 will overlap column 0 of next cell
        Height: 1,      // if we wanted a "next layer out" to come in at the same spacing, would use +1 here
                        // but currently for ease of sizing an isolated layer...
        Pnts: [
            [1, 1], [2, 0], [4, 0], [4.5, 1], [3, 1], [2, 0], [0.3, 0], [1, 1], [3, 1], [4, 0], [5.5, 0], [5.5, 1],
        ]
    };

    function add_ring(centre, rad) {
        let points = [];

        for(let i = 0; i < 36; i++) {
            let ang = 2 * Math.PI / 36 * i;
            points.push([ centre[0] + rad * Math.sin(ang), centre[1] + rad * Math.cos(ang)]);
        }

        return MakeCKnot([{
            Drawer: Drawers.home_ring,
            Step: 10,
            Points: points,
            Open: false,
            Order: 2
        }]);
    }

    // x is measured in line thicknesses
    // y is 0 on the inside of the ring and 1 on the outside
    let tie_tile = {
        FSeqs: [
            [ [1.25, 0], [1.5, 1], [0, 1.8], [0, 5] ],
            [ [0.25, 0], [0.5, 1] ],
            [ [-0.75, 0], [-0.5, 1] ],
            [ [0.9, 1.8], [-1.0, 1.55] ],
            [ [-0.7, 1.8], [1, 1.6] ],
        ],
        BSeqs: [
            [ [-1.5, 1], [0.9, 1.8] ],
        ]
    };

    let tie1 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 0.66,
        92, 40, "strand1");

    let tie2 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 1.33,
        92, 40, "strand2");

    let tie3 = MakeRadialTie(tie_tile, [0, 0], Math.PI * -0.2,
        92, 40, "strand3");

    let base_plate = add_ring([0, 0], 112.5);

    let knot = MakeTemplateKnotRadial(knot_tile, [0, 0], 100, 125, 14, base_plate,
        [ /* tie1, tie2, tie3 */ ], Drawers.home_knot);

    knot.Draw($(".test-line"));
});