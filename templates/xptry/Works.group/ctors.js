"use strict";

$(document).ready(function() {
    let home = function() {
        return (element, data) => {
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

            // let debug = [];

			let torus_width = data.width * 0.39;

            data.connections.forEach(connect => {
                let target = connect.to;

                if (connect.waypoints.length > 0) {
                    target = connect.waypoints[0];
                }

                let tie = MakeRadialTieFromTargetPoint(tie_tile,
                    [0, 0],
                    [target.centre_x - data.centre_x, target.centre_y - data.centre_y],
                    torus_width * 0.695, torus_width * 0.3, connect.drawer,
                    "#" + connect.to.url_title);

                ties.push(tie);

                connect.TPoint = [tie.TPoint[0] + data.centre_x,
                    tie.TPoint[1] + data.centre_y];

                // debug.push({
                //     TPoint: tie.TPoint,
                //     drawer: connect.drawer
                // });
            });

            let svg = add_svg(element, -data.width / 2, -data.height / 2, data.width, data.height);

            ties.forEach(tie => tie.BackDraw(svg));

            let torus_image = $("<img src='/upload/resources/infrastructure/Home_Knot.png' style='left:"
            	+ (data.width / 2 - torus_width) + "px; top:"
                + (data.height / 2 - torus_width) + "px; width:"
                + (torus_width * 2) + "px; height:"
                + (torus_width * 2) + "px' class='absolute zero-spacing rotating'>");

            element.append(torus_image);

//            add_holed_circle(svg, torus_width, torus_width * 0.712,
//        		"stroke-width:0;", "rotating", "/upload/resources/infrastructure/Home_Knot.png", "hometorus");

            svg = add_svg(element, -data.width / 2, -data.height / 2, data.width, data.height);

            ties.forEach(tie => tie.ForeDraw(svg));
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