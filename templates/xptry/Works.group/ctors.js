$(document).ready(function() {
    let home = function() {
        let draw1 = MakeKnotDrawer(6, [255,0,0], 2, [255,255,255], 4, [255,255,255], 2, [0,0,0], "knot");

        let draw_ring = MakeKnotDrawer(37, [0,0,0], 0, null, 35, [255,255,255], 0, null, "knot", true);
        // = {
        //     ForeDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
        //         add_polyline_scaled(insert_element, startparam, endparam, step, knot,
        //             'stroke:rgb(0,0,0);stroke-width:37;fill:none;stroke-linecap:butt;',
        //             close, 1, wrap);
        //         add_polyline_scaled(insert_element, startparam, endparam, step, knot,
        //             'stroke:rgb(255,255,255);stroke-width:35;fill:none;stroke-linecap:butt;',
        //             close, 2, wrap);
        //     },
        //     BackDrawKnot: function(insert_element, startparam, endparam, step, knot, close, wrap) {
        //         // add_polyline_scaled(insert_element, startparam, endparam, step, knot,
        //         //     'stroke:rgb(255,255,255);stroke-width:8;fill:none;stroke-linecap:butt;',
        //         //     close, 0, wrap);
        //     }
        // };

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
                Drawer: draw_ring,
                Step: 10,
                Points: points,
                Open: false,
                Order: 2
            }]);
        }

        let draw_tie = MakePolylineDrawer(
            7, [128,64,128],
            1, [0,0,0],
            2, [255,128,196], [-1, -2],
            "thread"
        );

        let draw_tie2 = MakePolylineDrawer(
            7, [64,64,128],
            1, [0,0,0],
            2, [128,128,196], [-1, -2],
            "thread"
        );

        let draw_tie3 = MakePolylineDrawer(
            7, [128,128,64],
            1, [0,0,0],
            2, [196,196,128], [-1, -2],
            "thread"
        );

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

        let tie1 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 0.66, 8,
            92, 40, draw_tie);

        let tie2 = MakeRadialTie(tie_tile, [0, 0], Math.PI * 1.33, 8,
            92, 40, draw_tie2);

        let tie3 = MakeRadialTie(tie_tile, [0, 0], Math.PI * -0.2, 8,
            92, 40, draw_tie3);

        let base_plate = add_ring([0, 0], 112.5);

        let knot = make_template_knot_radial(knot_tile, [0, 0], 100, 125, 14, base_plate,
            [ tie1, tie2, tie3 ], draw1);

        return (element, data) => {
            let svg = $("<svg class='fill' viewBox='-150 -150 300 300'></svg>");

            element.append(svg);

            knot.Draw(svg);
        };
    }

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        let do_one_image = (element, images, rnd, width, height) => {
            let x = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * width;
            let y = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * height;
            let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
            let persp = front_edge_perspective_distance / (front_edge_perspective_distance + height - y);
            let idx = Math.floor(rnd.quick() * images.length);

            scale *= persp;

            x = (x - width / 2) * persp + width / 2;
            y = (y - height / 2) * persp + height / 2;

            let ne = $("<img src='" + images[idx] + "'>").attr({
                class: "absolute zero-spacing"
            });

            ne.on("load", (event) => {
                let hx = x - ne.width() / 2;
                let hy = y - ne.height() / 2;

                ne.css({
                    transform: "translate(" + hx + "px, " + hy + "px) scale(" + scale + ", " + scale * aspect + ")",
                });
            });

            element.append(ne);
        };

        return (element, data) => {
            let area = data.width * data.height;
            let number = area * density;
            let rnd = MakeRand(element.attr("id"));

            for(let i = 0; i < number; i++) {
                do_one_image(element, data.images, rnd, data.width, data.height);
            }
        }
    }

    window.Ctors = {
        "home" : home,
        "image_field" : image_field,
        "dummy" : function(element, data) {}
    }
});