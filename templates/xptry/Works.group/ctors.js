"use strict";

$(document).ready(function() {
    let home = function() {
        return function() {
            // x is measured in line thicknesses
            // y is 0 on the inside of the ring and 1 on the outside
            let tie_tile = {
                FSeqs: [
                    new CoordArray([ [1.25, 0], [1.5, 1], [0, 1.8] ]),
                    new CoordArray([ [0.25, 0], [0.5, 1] ]),
                    new CoordArray([ [-0.75, 0], [-0.5, 1] ]),
                    new CoordArray([ [0.9, 1.8], [-1.0, 1.55] ]),
                    new CoordArray([ [-0.7, 1.8], [1, 1.6] ]),
                ],
                BSeqs: [
                    new CoordArray([ [-1.5, 1], [0.9, 1.8] ]),
                ],
                CPoint: new Coord(0, 1.8)
            };

            let torus_width = this.width * 0.39;

            this.connections.forEach(connect => {
                let node = this;

                connect.CalcStrandPoint = function(other_point) {
                    this.tie = MakeRadialTieFromTargetPoint(tie_tile,
                        node.centre,
                        other_point.Sub(node.centre),
                        torus_width * 0.695, torus_width * 0.3, connect.drawer,
                        "#" + connect.to.url_title);

                    // recalculated by the above...
                    return connect.tie.CPoint;
                }
            });

            let draw = (element) => {
                let svg = add_svg(element,
                    this.centre,
                    this.dims.Div(2).Inverse(),
                    this.dims,
                    "xx" + this.url_title,
                    window.Zs.BehindNodeContent);

                this.connections.forEach(connect => connect.tie.BackDraw(svg));

                let torus_image = $("<img src='/upload/resources/infrastructure/Home_Knot.png'>").css({
                    left: (this.centre.X - torus_width) + "px",
                    top: (this.centre.Y - torus_width) + "px",
                    width: (torus_width * 2) + "px",
                    height: (torus_width * 2) + "px",
                    "z-index": window.Zs.NodeContent
                }).addClass("absolute zero-spacing rotating xx" + this.url_title);

                element.append(torus_image);

                svg = add_svg(element,
                    this.centre,
                    this.dims.Div(2).Inverse(),
                    this.dims,
                    "xx" + this.url_title,
                    window.Zs.InFrontOfNodeContent);

                this.connections.forEach(connect => connect.tie.ForeDraw(svg));
            };

            this.Draw = draw;
        };
    };

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        return function() {
            let do_one_image = (element, images, rnd, centre, dims) => {
                let x = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * dims.X;
                let y = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * dims.Y;
                let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
                let persp = front_edge_perspective_distance / (front_edge_perspective_distance + dims.Y - y);
                let idx = Math.floor(rnd.quick() * images.length);

                scale *= persp;

                x = (x - dims.X / 2) * persp;
                y = (y - dims.Y / 2) * persp;

                let ne = $("<img src='" + images[idx] + "'>").attr({
                    class: "absolute zero-spacing"
                });

                ne.on("load", (event) => {
                    let hx = x - ne.width() / 2 + centre.X;
                    let hy = y - ne.height() / 2 + centre.Y;

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
                        this.centre,
                        this.dims);
                }
            };

            // the only strand-point we have is the centre,
            // but we probably won't route strands through here in time...
            let calc_strand_point = function(other_point, out) {
                return this.centre;
            };

            this.Draw = draw;
            this.CalcStrandPoint = calc_strand_point;
        };
    };

	let pulley = function(radius, lefthand) {
        return function() {
            //
            //                                   ____tp
            //                         _____-----    | \
            //               _____-----            c |  \ B, a
            //     _____-----                        |   \
            // op <----------------------------------Q---->C
            //    <--------------------A------------------>
            //                                        <-b->
            // op = other_point
            // C = centre of circle
            // tp = the point we need the tangent to hit on the circle
            // Q = the normal projection from op<->C to tp
            //
            // distances:
            // op-C = A
            // tp-C = B = a (= radius of circle)
            // Q-C = b
            // tp-Q = c
            //
            // op-tp-C and op-Q-tp are similar triangles
            // so: A/B = a/b = B/b
            //     A/B^2 = 1/b
            //     b = B^2/A
            //
            // which gives us c by pythagorus:
            // c = sqrt(a^2 - b^2)
            //
            // define dA as the direction from op->C
            // and dC as a direction at 90 degrees to that:
            // so tp = C - b * bA + c * dC
            //
            // and we get two alternative tangent points, according to which way we rotate from dA to dC
            //
            this.CalcStrandPoint = function (other_point, out, drawer) {
                // XOR
                let h_out = (!out) != (!lefthand);

                // won't need this when we've converted more to coords...
                let vA = this.centre.Sub(other_point);
                let A = vA.Dist();
                let h_radius = radius + drawer.Width / 2;
                let r2 = h_radius * h_radius;
                let b = r2 / A;
                let c = Math.sqrt(r2 - b * b);
                let dA = vA.Div(A);
                let dC = h_out ? dA.Rot90() : dA.Rot270();

                let tp = this.centre.Sub(dA.Mult(b)).Add(dC.Mult(c));

                // will need a note of the tangent direction to calculate the arc
                this.vecs = this.vecs || {};
                this.vecs[out] = tp.Sub(other_point).ToUnit();

                return tp;
            };

            this.Draw = function(element) {
                let svg = add_svg(element,
                    this.centre,
                    this.dims.Div(2).Inverse(),
                    this.dims,
                    "xx" + this.url_title,
                    window.Zs.BehindNodeContent);

                add_circle(svg,
                    [0, 0],
                    "fill: rgb(128,96,96);",
                    "fake",
                    radius);
            };
        };
    }

    window.Ctors = {
        "home" : home,
        "image_field" : image_field,
        "dummy" : function() {},
        "pulley": pulley}
});