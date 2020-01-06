$(document).ready(function(){
    var draw1 = {
        ForeDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(255,0,0);stroke-width:6;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(255,255,255);stroke-width:4;fill:none;stroke-linecap:butt;',
                close, 2, wrap);
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(0,0,0);stroke-width:2;fill:none;stroke-linecap:butt;',
                close, 3, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(255,255,255);stroke-width:8;fill:none;stroke-linecap:butt;',
                close, 0, wrap);
        }
    };

    var draw_ring = {
        ForeDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(0,0,0);stroke-width:37;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
            add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                'stroke:rgb(255,255,255);stroke-width:35;fill:none;stroke-linecap:butt;',
                close, 2, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
            // add_polyline_scaled(insert_element, startparam, endparam, step, knot,
            //     'stroke:rgb(255,255,255);stroke-width:8;fill:none;stroke-linecap:butt;',
            //     close, 0, wrap);
        }
    };

    var knot_tile = {
        Width: 6,       // column 6 will overlap column 0 of next cell
        Height: 1,      // if we wanted a "next layer out" to come in at the same spacing, would use +1 here
                        // but currently for ease of sizing an isolated layer...
        Pnts: [
            [1, 1], [2, 0], [4, 0], [4.5, 1], [3, 1], [2, 0], [0.3, 0], [1, 1], [3, 1], [4, 0], [5.5, 0], [5.5, 1],
        ]
    };

    // we may not reach outer_rad, but that's where a next layer would go...
    function apply_template(tile, centre, inner_rad, outer_rad, repeats) {
        var points = [];

        const num_angles = tile.Width * repeats;
        const ang_step = 2 * Math.PI / num_angles;
        var rad_step = (outer_rad - inner_rad) / tile.Height;

        // var sks = [];
        // var cks = [];

        // for(var k = 0; k < num_angles; k++) {
        //     sks.push(Math.sin(k / num_angles * Math.PI * 2));
        //     cks.push(-Math.cos(k / num_angles * Math.PI * 2));
        // }

        function transform_point(pnt, base_ang_idx) {
            var ang_idx = base_ang_idx + pnt[0];

            if (ang_idx > num_angles) {
                ang_idx -= num_angles;
            }

            var rad = inner_rad + pnt[1] * rad_step;

            return [ centre[0] + rad * Math.sin(ang_idx * ang_step),
                     centre[1] + rad * -Math.cos(ang_idx * ang_step) ];
        }

        for(var base_ang_idx = 0; base_ang_idx < num_angles; base_ang_idx += tile.Width )
        {
            tile.Pnts.forEach(pnt => {
                points.push(transform_point(pnt, base_ang_idx));
            });
        }

        knot = MakeCKnot([{
            Drawer: draw1,
            Step: 2,
            Points: points,
            Open: false,
            Order: 3
        }])

        knot.Draw($(".test-line"));
    }

    function add_ring(centre, rad) {
        var points = [];

        for(var i = 0; i < 36; i++) {
            var ang = 2 * Math.PI / 36 * i;
            points.push([ centre[0] + rad * Math.sin(ang), centre[1] + rad * Math.cos(ang)]);
        }

        knot = MakeCKnot([{
            Drawer: draw_ring,
            Step: 10,
            Points: points,
            Open: false,
            Order: 2
        }]);

        knot.Draw($(".test-line"));
    }

    add_ring([0, 0], 112.5);

    apply_template(knot_tile, [0, 0], 100, 125, 14);

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    // x is measured in line thicknesses
    var tie_tile = [
        [ [1.5, 1], [0, 1.8], [0, 5] ],
        [ [0.5, 0], [0.5, 1] ],
        [ [-0.5, 0], [-0.5, 1] ],
        [ [-1.5, 0], [-1.5, 1], [0.5, 2] ],
        [ [-0.7, 1.8], [1, 1.6] ]
    ];

    function add_tie(ang, thick, inner_rad, outer_rad, tile, style) {
        var rad_dir = [Math.sin(ang), -Math.cos(ang)];
        var tang_dir = [rad_dir[1], -rad_dir[0]];
        var rad_width = outer_rad - inner_rad;

        function transform_point(p) {
            var rad = inner_rad + rad_width * p[1];
            var tang = p[0] * thick;

            return [rad * rad_dir[0] + tang * tang_dir[0],
                rad * rad_dir[1] + tang * tang_dir[1]];
        }

        tile.forEach(seq => {
            var points = [];

            seq.forEach(pnt => {
                points.push(transform_point(pnt));
            });

            add_raw_polyline($(".test-line"), points, style, false);
        });
    }

    add_tie(Math.PI * 0.66, 8, 94, 131, tie_tile,
        'stroke:rgb(64,64,128);stroke-width:8;fill:none;stroke-linecap:round;')
    add_tie(Math.PI * 1.33, 8, 94, 131, tie_tile,
        'stroke:rgb(64,128,64);stroke-width:8;fill:none;stroke-linecap:round;')
    add_tie(Math.PI * -0.2, 8, 94, 131, tie_tile,
        'stroke:rgb(128,64,128);stroke-width:8;fill:none;stroke-linecap:round;')
});