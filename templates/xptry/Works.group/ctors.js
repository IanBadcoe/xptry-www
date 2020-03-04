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
                    [data.centre_x, data.centre_y],
                    [target.centre_x - data.centre_x, target.centre_y - data.centre_y],
                    torus_width * 0.695, torus_width * 0.3, connect.drawer,
                    "#" + connect.to.url_title);

                ties.push(tie);

                connect.TPoint = tie.TPoint;

                // debug.push({
                //     TPoint: tie.TPoint,
                //     drawer: connect.drawer
                // });
            });

            let svg = add_svg(element,
                [data.centre_x, data.centre_y],
                -data.width / 2, -data.height / 2,
                data.width, data.height,
                "xx" + data.url_title,
                window.Zs.BehindNodeContent);

            ties.forEach(tie => tie.BackDraw(svg));

            let torus_image = $("<img src='/upload/resources/infrastructure/Home_Knot.png'>").css({
            	left: (data.centre_x - torus_width) + "px",
                top: (data.centre_y - torus_width) + "px",
                width: (torus_width * 2) + "px",
                height: (torus_width * 2) + "px",
                "z-index": window.Zs.NodeContent
            }).addClass("absolute zero-spacing rotating xx" + data.url_title);

            element.append(torus_image);

            svg = add_svg(element,
                [data.centre_x, data.centre_y],
                -data.width / 2, -data.height / 2,
                data.width, data.height,
                "xx" + data.url_title,
                window.Zs.InFrontOfNodeContent);

            ties.forEach(tie => tie.ForeDraw(svg));
        };
    }

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        let do_one_image = (element, images, rnd, centre_x, centre_y, width, height) => {
            let x = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * width;
            let y = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * height;
            let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
            let persp = front_edge_perspective_distance / (front_edge_perspective_distance + height - y);
            let idx = Math.floor(rnd.quick() * images.length);

            scale *= persp;

            x = (x - width / 2) * persp;
            y = (y - height / 2) * persp;

            let ne = $("<img src='" + images[idx] + "'>").attr({
                class: "absolute zero-spacing"
            });

            ne.on("load", (event) => {
                let hx = x - ne.width() / 2 + centre_x;
                let hy = y - ne.height() / 2 + centre_y;

                ne.css({
                    transform: "translate(" + hx + "px, " + hy + "px) scale(" + scale + ", " + scale * aspect + ")",
                    "z-index": window.Zs.Decor
                });
            });

            element.append(ne);
        };

        return (element, data) => {
            let area = data.width * data.height;
            let number = area * density;
            let rnd = MakeRand(element.attr("id"));

            for(let i = 0; i < number; i++) {
                do_one_image(element, data.images, rnd,
                    data.centre_x, data.centre_y,
                    data.width, data.height);
            }
        }
    }

	let pully = function(radius, lefthand) {
    
    }
    
    window.Ctors = {
        "home" : home,
        "image_field" : image_field,
        "dummy" : function(element, data) {},
        "pully": pully}
});