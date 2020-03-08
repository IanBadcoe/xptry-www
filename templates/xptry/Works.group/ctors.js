"use strict";

$(document).ready(function() {
    let home = function() {
        return function() {
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

            this.ties = [];

            let torus_width = this.width * 0.39;

            this.connections.forEach(connect => {
                let target = connect.to;

                if (connect.waypoints.length > 0) {
                    target = connect.waypoints[0];
                }

                let tie = MakeRadialTieFromTargetPoint(tie_tile,
                    [this.centre_x, this.centre_y],
                    [target.centre_x - this.centre_x, target.centre_y - this.centre_y],
                    torus_width * 0.695, torus_width * 0.3, connect.drawer,
                    "#" + connect.to.url_title);

                this.ties.push(tie);

                connect.TPoint = tie.TPoint;
            });

            let draw = (element) => {
                let svg = add_svg(element,
                    [this.centre_x, this.centre_y],
                    -this.width / 2, -this.height / 2,
                    this.width, this.height,
                    "xx" + this.url_title,
                    window.Zs.BehindNodeContent);

                this.ties.forEach(tie => tie.BackDraw(svg));

                let torus_image = $("<img src='/upload/resources/infrastructure/Home_Knot.png'>").css({
                    left: (this.centre_x - torus_width) + "px",
                    top: (this.centre_y - torus_width) + "px",
                    width: (torus_width * 2) + "px",
                    height: (torus_width * 2) + "px",
                    "z-index": window.Zs.NodeContent
                }).addClass("absolute zero-spacing rotating xx" + this.url_title);

                element.append(torus_image);

                svg = add_svg(element,
                    [this.centre_x, this.centre_y],
                    -this.width / 2, -this.height / 2,
                    this.width, this.height,
                    "xx" + this.url_title,
                    window.Zs.InFrontOfNodeContent);

                    this.ties.forEach(tie => tie.ForeDraw(svg));
            };

            this.Draw = draw;
        };
    };

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        return function() {
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

            let draw = (element) => {
                let area = this.width * this.height;
                let number = area * density;
                let rnd = MakeRand(element.attr("id"));

                for(let i = 0; i < number; i++) {
                    do_one_image(element, this.images, rnd,
                        this.centre_x, this.centre_y,
                        this.width, this.height);
                }
            };

            // the only strand-point we have is the centre,
            // but we probably won't route strands through here in time...
            let calc_strand_point = function(other_point, out) {
                return [this.centre_x, this.centre_y];
            };

            this.Draw = draw;
            this.CalcStrandPoint = calc_strand_point;
        };
    };

	let pully = function(radius, lefthand) {

    }

    window.Ctors = {
        "home" : home,
        "image_field" : image_field,
        "dummy" : function() {},
        "pully": pully}
});