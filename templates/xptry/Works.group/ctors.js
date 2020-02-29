"use strict";

$(document).ready(function() {
    let home = function() {
        return (element, data) => {
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
                    Drawer: window.Drawers.home_ring,
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
                    [ [1.25, 0], [1.5, 1], [0, 1.8]/*, [0, 5]*/ ],
                    [ [0.25, 0], [0.5, 1] ],
                    [ [-0.75, 0], [-0.5, 1] ],
                    [ [0.9, 1.8], [-1.0, 1.55] ],
                    [ [-0.7, 1.8], [1, 1.6] ],
                ],
                BSeqs: [
                    [ [-1.5, 1], [0.9, 1.8] ],
                ],
                TPoint: [0, 1.8]
            };

            let ties = [];

            let debug = [];

            data.connections.forEach(connect => {
                let target = connect.to;

                if (connect.waypoints.length > 0) {
                    target = connect.waypoints[0];
                }

                let tie = MakeRadialTieFromTargetPoint(tie_tile,
                    [0, 0],
                    [target.centre_x - data.centre_x, target.centre_y - data.centre_y],
                    92, 40, connect.drawer,
                    "#" + connect.to.url_title);

                ties.push(tie);

                connect.TPoint = [tie.TPoint[0] + data.centre_x,
                    tie.TPoint[1] + data.centre_y];

                debug.push({
                    TPoint: tie.TPoint,
                    drawer: connect.drawer
                });
            });

            let base_plate = add_ring([0, 0], 112.5);

            let knot = MakeTemplateKnotRadial(knot_tile, [0, 0], 100, 125, 14, base_plate,
                ties, window.Drawers.home_knot);

            let svg = add_svg(element, -data.width / 2, -data.height / 2, data.width, data.height);

            knot.Draw(svg);

            debug.forEach(pnt => {
                let drawer = window.Drawers[pnt.drawer];

                add_circle(svg, pnt.TPoint, null, "debug-white", drawer.Width / 4);
            });
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