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
    function make_template_knot_radial(tile, centre, inner_rad, outer_rad, repeats, base_plate, decorators) {
        var points = [];

        const num_angles = tile.Width * repeats;
        const ang_step = 2 * Math.PI / num_angles;
        var rad_step = (outer_rad - inner_rad) / tile.Height;

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

        return MakeAdvCKnot([{
            Drawer: draw1,
            Step: 2,
            Points: points,
            Open: false,
            Order: 3
        }],
        base_plate, decorators)
    }

    function add_ring(centre, rad) {
        var points = [];

        for(var i = 0; i < 36; i++) {
            var ang = 2 * Math.PI / 36 * i;
            points.push([ centre[0] + rad * Math.sin(ang), centre[1] + rad * Math.cos(ang)]);
        }

        return MakeCKnot([{
            Drawer: draw_ring,
            Step: 10,
            Points: points,
            Open: false,
            Order: 2
        }]);
    }

    var draw_tie = {
        ForeDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(182,64,128);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline_offset(insert_element, points,
                'stroke:rgb(255,128,196);stroke-width:2;fill:none;stroke-linecap:round;',
                close, [-1, -2]);
            },
        BackDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(182,64,128);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
        }
    };

    var draw_tie2 = {
        ForeDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(64,64,128);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline_offset(insert_element, points,
                'stroke:rgb(128,128,196);stroke-width:2;fill:none;stroke-linecap:round;',
                close, [-1, -2]);
            },
        BackDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(64,64,128);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
        }
    };

    var draw_tie3 = {
        ForeDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(128,128,64);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline_offset(insert_element, points,
                'stroke:rgb(196,196,128);stroke-width:2;fill:none;stroke-linecap:round;',
                close, [-1, -2]);
            },
        BackDrawPolyline: function(insert_element, points, close) {
            add_raw_polyline(insert_element, points,
                'stroke:rgb(0,0,0);stroke-width:8;fill:none;stroke-linecap:round;',
                close);
            add_raw_polyline(insert_element, points,
                'stroke:rgb(128,128,64);stroke-width:7;fill:none;stroke-linecap:round;',
                close);
        }
    };

    // x is measured in line thicknesses
    var tie_tile = {
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

    var tie1 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 0.66, 8,
        92, 40, draw_tie);

    var tie2 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 1.33, 8,
        92, 40, draw_tie2);

    var tie3 = MakeRadialTie(tie_tile, [0, 0], Math.PI * -0.2, 8,
        92, 40, draw_tie3);

    var base_plate = add_ring([0, 0], 112.5);

    var knot = make_template_knot_radial(knot_tile, [0, 0], 100, 125, 14, base_plate,
        [ tie1, tie2, tie3 ]);

    knot.Draw($(".test-line"));
});