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
        Height: 1,
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

        for(var ang = 0; ang < Math.PI * 2; ang += 0.1) {
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
});