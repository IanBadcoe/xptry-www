"use strict";

$(document).ready(function() {
    function home() {
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

            let torus_width = this.dims.X * 0.39;

            this.connections.forEach(connect => {
                let node = this;

                let dest = connect.forwards ? connect.path.to : connect.path.from;

                connect.CalcStrandPoint = function(other_point, forward, drawer, final) {
                    if (final) {
                        this.tie = MakeRadialTieFromTargetPoint(tie_tile,
                            node.centre,
                            other_point.Sub(node.centre),
                            torus_width * 0.695, torus_width * 0.3, connect.path.drawer,
                            "#" + dest.url_title);

                        // recalculated by the above...
                        return connect.tie.CPoint;
                    } else {
                        return GetRadialTieSPoint(tie_tile,
                            node.centre,
                            other_point.Sub(node.centre),
                            torus_width * 0.695, torus_width * 0.3, connect.path.drawer);
                    }
                }
            });

            this.load = ret_fn => {
                let svg = add_svg(null,
                    this.centre,
                    this.dims.Div(2).Inverse(),
                    this.dims,
                    null,
                    Zs.BehindNodeContent);

                this.connections.forEach(connect => connect.tie.BackDraw(svg));

                ret_fn(svg);

                let torus_image = $("<img src='/upload/resources/infrastructure/Home_Knot.png'>").css({
                    left: (this.centre.X - torus_width),
                    top: (this.centre.Y - torus_width),
                    width: (torus_width * 2),
                    height: (torus_width * 2),
                    "z-index": Zs.NodeContentL1
                }).addClass("absolute zero-spacing rotating");

                ret_fn(torus_image);

                svg = add_svg(null,
                    this.centre,
                    this.dims.Div(2).Inverse(),
                    this.dims,
                    null,
                    Zs.InFrontOfNodeContent);

                this.connections.forEach(connect => connect.tie.ForeDraw(svg));

                ret_fn(svg);
            };

            this.rect = new Rect(
                this.centre.Sub(this.dims.Div(2)),
                this.centre.Add(this.dims.Div(2))
            );

            PSM.GetDemandLoader(1.0).Register(this);
        };
    };

    function image_field(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        return function() {
            let do_one_image = (images, rnd, centre, dims) => {
                let x = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * dims.X;
                let y = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * dims.Y;
                let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
                let persp = front_edge_perspective_distance / (front_edge_perspective_distance + dims.Y - y);
                let idx = Math.floor(rnd.quick() * images.length);

                scale *= persp;

                x = (x - dims.X / 2) * persp;
                y = (y - dims.Y / 2) * persp;

                let ne = ImageCache.Element(images[idx]);

                ne.addClass("absolute zero-spacing");

                let hx = x - ne.width() / 2 + centre.X;
                let hy = y - ne.height() / 2 + centre.Y;

                ne.css({
                    transform: "translate(" + hx + "px, " + hy + "px) scale(" + scale + ", " + scale * aspect + ")",
                    "z-index": Zs.Decor
                });

                return ne;
            };

            this.load = ret_fn => {
                let area = this.dims.X * this.dims.Y;
                let number = area * density;
                let rnd = MakeRand(this.url_title);

                for(let i = 0; i < number; i++) {
                    ret_fn(do_one_image(this.images, rnd,
                        this.centre,
                        this.dims));
                }
            };

            this.rect = new Rect(
                this.centre.Sub(this.dims),
                this.centre.Add(this.dims)
            );

            // double size of rect to allow for pictures spilling over boundary a bit
            PSM.GetDemandLoader(1.0).Register(this);

            // the only strand-point we have is the centre,
            // but we probably won't route strands through here in time...
            let calc_strand_point = function(other_point) {
                return this.centre;
            };

            this.CalcStrandPoint = calc_strand_point;
        };
    };

	function pulley(radius, clockwise) {
        return function() {
            this.clockwise = clockwise;
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
                // XOR the direction we're tracing in with whether this is a left or righthand pulley
                let h_out = (!out) !== (!clockwise);

                // won't need this when we've converted more to coords...
                let vA = this.centre.Sub(other_point);
                let A = vA.Dist();
                let h_radius = radius + drawer.Width / 2;
                let r2 = h_radius * h_radius;
                let b = r2 / A;

                if (r2 - b * b <= 0) {
                    throw "pulley too close exception :-)";
                }

                let c = Math.sqrt(r2 - b * b);
                let dA = vA.Div(A);
                let dC = h_out ? dA.Rot90() : dA.Rot270();

                let tp = this.centre.Sub(dA.Mult(b)).Add(dC.Mult(c));

                this.spokes = this.spokes || {}
                this.spokes[out] = tp.Sub(this.centre);

                if (this.spokes[true] && this.spokes[false]) {
                    this.signed_angle = this.spokes[false].SignedAngle(this.spokes[true]);
                    // this.drawer = drawer;   // we don't actually know this, it comes from the path...
                    // we do now...
                }

                return tp;
            };

            let pulley_data = this;
            let half_rad = radius + this.drawer.Width + 1;
            let half_size = new Coord(half_rad, half_rad);

            this.load = ret_fn => {
                let svg = add_svg(null,
                    pulley_data.centre,
                    half_size.Inverse(),
                    half_size.Mult(2),
                    null,
                    Zs.Strand);

                add_circle(svg,
                    [0, 0],
                    "fill: rgb(128,96,96);",
                    null,
                    radius);

                if (pulley_data.drawer) {
                    pulley_data.drawer.ForeDrawPolylineArc(svg,
                        pulley_data.SPoint[false].Sub(pulley_data.centre), pulley_data.SPoint[true].Sub(pulley_data.centre), radius,
                        pulley_data.clockwise,
                        pulley_data.clockwise === (pulley_data.signed_angle < 0),
                        "strand-inner");
                }

                ret_fn(svg);
            };

            this.rect = new Rect(this.centre.Sub(half_size), this.centre.Add(half_size));

            PSM.GetDemandLoader(1.0).Register(this);
        };
    }

    function synth_pulley(centre, radius) {}

    function horz_thread (height, width_step, strip_offset_frac) {
        return function() {
            let num = this.num_articles || 0;

            let width = (num + 2) * width_step;

            let tl = new Coord(this.centre);
            tl.Y -= height / 2;

            // let conn_h_step = height / (this.connections.length + 1);
            // let curr_conn_h_offset = conn_h_step / 2;

            this.connections.forEach(connect => {
                let node = this;

                connect.CalcStrandPoint = function(other_point, forward, drawer, final) {
                    return node.centre;
                }
            });

            this.rect = new Rect(tl, tl.Add(new Coord(width, height)));

            let promises = [];

            this.images.forEach(image => {
                promises.push(ImageCache.Promise(image.file));
            });

            let image_sets = {};

            let max_image_height = 0;

            let all_images_promise = Promise.all(promises)
                .then(
                    () => {
                        this.images.forEach(image => {
                            image_sets[image.type] = image_sets[image.type] || [];

                            image_sets[image.type].push(image);

                            max_image_height = Math.max(max_image_height, ImageCache.Dims(image.file).Y);
                        });                    
                    }
                );

            this.load = ret_fn => {
                let rnd = MakeRand(this.url_title);

                var promises = [];

                promises.push(all_images_promise);

                promises.push(
                    $.ajax(
                        "{path='Ajax/articles'}/" + this.url_title + "/published",
                        {
                            dataType: "json"
                        }
                    ).then((data, status) => {
                        this._articles = data;
                    })
                );
                
                Promise.all(promises)
                    .then(() => {
                        // we use three layers, each of less than the total height,
                        // with the second and third layers back offset by this amount (and twice that)
                        let strip_height = height * (1 - strip_offset_frac * 2);
                        let scale4height = strip_height / max_image_height;

                        make_anchors_and_thread(scale4height, image_sets["Anchor"], this.num_articles, this.rect.BL, this.url_title, rnd, image_sets["Furniture"]);

                        make_image_strip(1.05, image_sets["Building"], this.rect.BL.Add(new Coord(width_step, -height * strip_offset_frac)), this.rect.R, scale4height, this.url_title, rnd);
                    }
                );
            };

            PSM.GetDemandLoader(1.0).Register(this);
        }

        function make_anchors_and_thread(scale4height, anchor_image_set, num_articles, bl, url_title, rnd, furniture_image_set) {
            let prev_row = null;
            let prev_tl = null;
            let prev_dims = null;
            let prev_height_offset = 0;

            for (let i = 0; i <= num_articles; i++) {
                let a_bc = bl.Add(new Coord((i + 1) * width_step, 0));

                let img_row = rand_from_array(anchor_image_set, rnd);

                let dims = place_parallax_image(1.0, img_row, scale4height, a_bc, url_title + ":anchor:" + i, "c");
                
                if (rnd.quick() < 0.15) {
                    place_parallax_image(1.0, rand_from_array(furniture_image_set, rnd), scale4height, a_bc.Add(new Coord(dims.X / 2, 0)), url_title + ":anchor:" + i + ":f_right", "l");
                }

                if (rnd.quick() < 0.15) {
                    place_parallax_image(1.0, rand_from_array(furniture_image_set, rnd), scale4height, a_bc.Add(new Coord(-dims.X / 2, 0)), url_title + ":anchor:" + i + ":f_left", "r");
                }

                function add_wrap_rounds(svg, start_h, end_h, right, width, drawer, rnd) {
                    let num_wraps = Math.max(Math.ceil(Math.abs(start_h - end_h) / width) + 1, 2);
                    let ch = start_h;
                    let step = (end_h - start_h) / (num_wraps * 2 + 1);
                    let rand_range = Math.abs(step) / 2 + width / 2;
                    for (let i = 0; i < num_wraps; i++) {
                        drawer.ForeDrawLine(svg, new Coord(right - width, ch + step + rand_range * (rnd.quick() - 0.5)), new Coord(right, ch + step * 2 + rand_range * (rnd.quick() - 0.5)));
                        ch += step * 2;
                    }
                }

                let strand_height_offset = i === num_articles ? 0 : (rnd.quick() + rnd.quick() + rnd.quick() - 1.5) * img_row.swidth * 2 * scale4height;
                let tl = a_bc.Add(new Coord(-dims.X / 2, -dims.Y));

                if (prev_row) {
                    let p1 = prev_tl.Add(new Coord((prev_row.spointx - prev_row.swidth / 2) * scale4height, prev_dims.Y - prev_row.spointy * scale4height + prev_height_offset));
                    let p2 = tl.Add(new Coord((img_row.spointx + img_row.swidth / 2) * scale4height, dims.Y - img_row.spointy * scale4height));
                    let catenary = {
                        rect: DrawCatenaryStrandBetweenPoints(null, p1, p2, 500, Drawers["wire"], true),
                        load: ret_fn => {
                            let svg = DrawCatenaryStrandBetweenPoints(null, p1, p2, 500, Drawers["wire"]).css({
                                "z-index": Zs.NodeContentL4
                            });
                            add_wrap_rounds(svg, p2.Y, p2.Y + strand_height_offset, p2.X, img_row.swidth * scale4height, Drawers["wire"], rnd);
                            if (i === 1) {
                                add_wrap_rounds(svg, p1.Y, p1.Y, p1.X + prev_row.swidth * scale4height, prev_row.swidth * scale4height, Drawers["wire"], rnd);
                            }
                            ret_fn(svg);
                        },
                        url_title: url_title + ":catenary:" + i
                    };

                    PSM.GetDemandLoader(1.0).Register(catenary);
                }
                prev_row = img_row;
                prev_tl = tl;
                prev_dims = dims;
                prev_height_offset = strand_height_offset;
            }
            return scale4height;
        }

        function make_image_strip(dist, image_set, bl, right, scale4height, url_title, rnd) {
            let b = bl.Y;
            let curr_left = bl.X;
            let i = 0;

            while(curr_left < right) {
                let img_row = rand_from_array(image_set, rnd);

                // we do not have perspective on Y, which means there isn't a perfect way to position this
                // (as X and Y need to be scaled down the same, which means the height of the image is scaled, so that I can position either the top or the bottom aligned with
                //  the 1.0 plane, but not both)
                // since Y is scaled down, but not moved with parallax we need to pick which out of top or bottom will be in the right place and since we want the ground to line up,
                // it has to be the bottom, so we need to pre-scale that up to get it in the right place after scaling down (parallax puts X in the right place)
                let pos = new Coord(curr_left, b * dist);

                let dims = place_parallax_image(dist, img_row, scale4height, pos, url_title + ":building:" + i, "l");

                curr_left += dims.X;

                i++;
            }
        }
     }

    window.Ctors = {
        home : home,
        image_field : image_field,
        dummy() {},
        pulley : pulley,
        horz_thread : horz_thread
    };
});

// posmode = "l", "r" or "c" for whether pos is bottom-left, bottom-right, or bottom-centre
function place_parallax_image(dist, img_row, scale, pos, here_title, posmode) {
    let img_name = img_row.file;
    let dims = ImageCache.Dims(img_name).Mult(scale);

    // assume pos === bl and, if it is not, fix up the resulting bl below
    let tl = pos.Add(new Coord(0, -dims.Y));

    if (posmode === "r") {
        tl = tl.Sub(new Coord(dims.X, 0));
    } else if (posmode === "c") {
        tl = tl.Sub(new Coord(dims.X / 2, 0));
    } else if (posmode !== "l") {
        throw "Bad posmode!"
    }

    let br = tl.Add(dims);

    let d_load = {
        rect: new Rect(tl, br),
        load: ret_fn => {
            let image = ImageCache.Element(img_name)
                .css({
                    left: tl.X,
                    top: tl.Y,
                    height: dims.Y,
                    width: dims.X,
                    "z-index": Zs.NodeContentL1
                })
                .addClass("absolute zero-spacing");

            ret_fn(image);
        },
        url_title: here_title
    };

    PSM.GetDemandLoader(dist).Register(d_load);

    return dims;
}