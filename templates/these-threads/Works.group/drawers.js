"use strict";

$(document).ready(() => {
    // used for strands and ties
    // width2, colour2, width3, colour3, klass
    // the anatomy of a strand is:
    // - a line of colour 'colour' and thickness 'width'
    // - surrounded by (optional) edges of colour 'edgecolour' and thickness 'edgethick'
    // - on top of the main line is an optional narrower line of thickness 'middlewidth' and colour 'middlecolour'
    // - and on top of that is a narrower-still line of thickness 'hilightwidth' and colour 'hilightcolour'
    //   which may be offset by an optional distance from the centre of 'hilightoffset'
    //
    // and all elements have an optional CSS class of 'klass' applied
    //
    // the two typical usages are:
    // 1) with middle and hilight engaged, but no hilightoffset, leading to a symmetrical, three-part stripe:
    //     -------------------- <- optional edge
    //     xxxxxxxxxxxxxxxxxxxx <- main colour
    //     yyyyyyyyyyyyyyyyyyyy <- middle colour
    //     yyyyyyyyyyyyyyyyyyyy
    //     zzzzzzzzzzzzzzzzzzzz <- hilight colour
    //     yyyyyyyyyyyyyyyyyyyy
    //     yyyyyyyyyyyyyyyyyyyy
    //     xxxxxxxxxxxxxxxxxxxx
    //     --------------------
    //
    // - this is used on knots and the "hilight" is acting merely as a third colour, or:
    // 2) with no middle, but the hilight engaged and offset
    //     -------------------- <- optional edge
    //     xxxxxxxxxxxxxxxxxxxx <- main colour
    //     zzzzzzzzzzzzzzzzzzzz <- hilight colour
    //     xxxxxxxxxxxxxxxxxxxx
    //     xxxxxxxxxxxxxxxxxxxx
    //     xxxxxxxxxxxxxxxxxxxx
    //     --------------------
    // this is used as a line with the hilght forming a lighting "hilight"
    //
    // generally with the methods on here ForeDrawKnot, BackDrawKnot are used type-1 drawers, and they work by drawing only the edges in BackDraw
    // (because with knots we only need the edges in our second pass which draws-in the "over" bits)
    // and the others are used with type-2 drawers where "BackDraw*", if used at all, is used to draw a "rear face" to the line, and that is
    // the main colour and the edges but no hilights/middle
    //
    // those aren't very different and should  work interchangeably, but that isn't how they were used previously so there may be
    // some issues waiting in the wings...
    let MakeDrawer = (width, colour, edgethick, edgecolour, middlewidth, middlecolour, hilightwidth, hilightcolour, hilightoffset, klass) => {
        let edgestyle = null;
        let middlestyle = null;
        let hilightstyle = null;
        // mostly happy just for this to be false, but need to do maths with it at one point...
        edgethick = edgethick || 0;

        if (edgethick) {
            edgestyle = {
                stroke: "rgb(" + edgecolour[0] + "," + edgecolour[1] + "," + edgecolour[2] + ")",
                "stroke-width" : width + edgethick,
            };
        }

        if (middlewidth) {
            middlestyle = {
                stroke: "rgb(" + middlecolour[0] + "," + middlecolour[1] + "," + middlecolour[2] + ")",
                "stroke-width" : middlewidth,
            };
        }

        if (hilightwidth) {
            hilightoffset = new Coord(hilightoffset || [0, 0]);
            hilightstyle = {
                stroke: "rgb(" + hilightcolour[0] + "," + hilightcolour[1] + "," + hilightcolour[2] + ")",
                "stroke-width" : hilightwidth,
            };
        }

        let style = {
            stroke: "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")",
            "stroke-width" : width,
        };

        return {
            ForeDrawLine(insert_element, p1, p2, override_klass, hilight_rotate, nudge) {
                let el = $();
                nudge = nudge || new Coord(0,0);

                let h_klass = override_klass || klass;
                if (edgestyle) {
                    el = el.add(add_line(insert_element, p1, p2, edgestyle, h_klass + " strand-edge"));
                }
                el = el.add(add_line(insert_element, p1, p2, style, h_klass + " strand-main", null, nudge));
                if (middlestyle) {
                    el = el.add(add_line(insert_element, p1, p2, middlestyle, h_klass + " strand-middle", null, nudge.Mult(1.5)));
                }
                if (hilightstyle) {
                    let h_ho = new Coord(hilight_rotate ? hilightoffset.Rotate(hilight_rotate) : hilightoffset);
                    el = el.add(add_line(insert_element, p1, p2, hilightstyle, h_klass + " strand-hilight", h_ho, nudge.Mult(2)));
                }

                return el;
            },
            BackDrawLine(insert_element, p1, p2) {
                let el = $();

                if (edgestyle) {
                    el = el.add(add_line(insert_element, p1, p2, edgestyle, klass + " strand-edge"));
                }
                el = el.add(add_line(insert_element, p1, p2, style, klass + " strand-main"));

                return el;
            },
            ForeDrawPolyline(insert_element, points, close, override_klass, hilight_rotate) {
                let el = $();

                let h_klass = override_klass || klass;
                if (edgestyle) {
                    el = el.add(add_raw_polyline(insert_element, points, edgestyle, close, h_klass + " strand-edge"));
                }
                el = el.add(add_raw_polyline(insert_element, points, style, close, h_klass + " strand-main"));
                if (middlestyle) {
                    el = el.add(add_raw_polyline(insert_element, points, middlestyle, close, h_klass + " strand-middle"));
                }
                if (hilightstyle) {
                    let h_ho = hilight_rotate ? hilightoffset.Rotate(hilight_rotate) : hilightoffset;
                    el = el.add(add_raw_polyline(insert_element, points, hilightstyle, close, h_klass + " strand-hilight", h_ho));
                }

                return el;
            },
            BackDrawPolyline(insert_element, points, close) {
                let el = $();

                if (edgestyle) {
                    el = el.add(add_raw_polyline(insert_element, points, edgestyle, close, klass + " strand-edge"));
                }
                el = el.add(add_raw_polyline(insert_element, points, style, close, klass + " strand-main"));

                return el;
            },
            ForeDrawPolylineArc(insert_element, p1, p2, radius, clockwise, largepart, override_klass, hilight_rotate) {
                let el = $();

                let h_klass = override_klass || klass;
                let h_radius = radius + this.Width / 2;
                if (edgestyle) {
                    el = el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, edgestyle, h_klass + " strand-edge"));
                }
                el = el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, style, h_klass + " strand-main"));
                if (middlestyle) {
                    el = el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, middlestyle, h_klass + " strand-middle"));
                }
                if (hilightstyle) {
                    let h_ho = hilight_rotate ? hilightoffset.Rotate(hilight_rotate) : hilightoffset;
                    el = el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, hilightstyle, h_klass + " strand-hilight", h_ho));
                }

                return el;
            },
            BackDrawPolylineArc(insert_element, p1, p2, radius, clockwise, largepart) {
                let el = $();

                let h_radius = radius + this.Width / 2;
                if (edgestyle) {
                    el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, edgestyle, klass + " strand-edge"));
                }
                el.add(add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, style, klass + " strand-main"));

                return el;
            },
            // "fill" is not a property of the drawer, because none of the other usages are particularly guaranteed to be a closed shape
            // but it can be an option here...
            ForeDrawPolylineCircle(insert_element, pos, radius, override_klass, fill, hilight_rotate) {
                let el = $();

                let h_klass = override_klass || klass;
                let h_radius = radius + this.Width / 2;
                let h_style = { ...style };
                if (fill) {
                    h_style.fill = fill;
                }
                if (edgestyle) {
                    el = el.add(add_circle(insert_element, pos, edgestyle, h_klass + " strand-edge", h_radius));
                }
                el.add(add_circle(insert_element, pos, h_style, h_klass + " strand-main", h_radius));
                if (middlestyle) {
                    el = el.add(add_circle(insert_element, pos, middlestyle, h_klass + " strand-middle", h_radius));
                }
                if (hilightstyle) {
                    let h_ho = hilight_rotate ? hilightoffset.Rotate(hilight_rotate) : hilightoffset;
                    el = el.add(add_circle(insert_element, pos.Add(h_ho), hilightstyle, h_klass + " strand-hilight", h_radius));
                }

                return el;
            },
            BackDrawPolylineCircle(insert_element, p1, p2, radius, clockwise, largepart) {
                let el = $();

                let h_radius = radius + this.Width / 2;
                if (edgestyle) {
                    el = el.add(add_circle(insert_element, pos, edgestyle, h_klass, h_radius + " strand-edge"));
                }
                el = el.add(add_circle(insert_element, pos, style, h_klass + " strand-main", h_radius));

                return el;
            },
            ForeDrawKnot(insert_element, startparam, endparam, step, knot, close, wrap, loop_klass) {
                let here_klass = klass || loop_klass;

                if (loop_klass && klass) {
                    here_klass = klass + " " + loop_klass;
                }

                add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                    style,
                    close, 1, wrap, here_klass);
                if (middlestyle) {
                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        middlestyle,
                        close, 2, wrap, here_klass);
                }
                if (hilightstyle) {
                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        hilightstyle,
                        close, 3, wrap, here_klass);
                }
            },
            BackDrawKnot(insert_element, startparam, endparam, step, knot, close, wrap, loop_klass) {
                if (edgestyle) {
                    let here_klass = klass || loop_klass;

                    if (loop_klass && klass) {
                        here_klass = klass + " " + loop_klass;
                    }

                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        edgestyle,
                        close, 0, wrap, here_klass);
                }
            },
            EdgeColour : edgecolour,
            MainColour : colour,
            MiddleColour : middlecolour,
            HilightColour : hilightcolour,
            Width: width,
            FullWidth: width + edgethick
        };
    }

    let MakeDrawerParams = p => MakeDrawer(p.width, p.colour, p.edgethick, p.edgecolour, p.middlewidth, p.middlecolour,
        p.hilightwidth, p.hilightcolour, p.hilightoffset, p.klass)

    window.Drawers = {
        home_knot : MakeDrawerParams({
            width: 6, colour: [255,0,0],
            edgethick: 2, edgecolour: [255,255,255],
            middlewidth: 4, middlecolour: [255,255,255],
            hilightwidth: 2, hilightcolour: [0,0,0], hilightoffset: [-1, -2],
            klass: "knot"
        }),
        home_ring : MakeDrawerParams({
            width: 37, colour: [0,0,0],
            middlewidth: 35, middlecolour: [255,255,255],
            klass: "knot"
        }),

        cartouche1 : MakeDrawerParams({
            width: 15, colour: [64,64,64],
            middlewidth: 13, middlecolour: [128,96,96],
            klass: "knot"
        }),
        cartouche_line1 : MakeDrawerParams({
            width: 4, colour: [160,128,128],
            edgethick: 1, edgecolour: [64,64,64],
            klass: "strand"
        }),
        cartouche2 : MakeDrawerParams({
            width: 20, colour: [64,64,64],
            middlewidth: 18, middlecolour: [96,129,96],
            hilightwidth: 6, hilightcolour: [128,160,128], hilightoffset: [-1, -2],
            klass: "knot"
        }),
        cartouche_line2 : MakeDrawerParams({
            width: 5, colour: [128,160,128],
            edgethick: 1, edgecolour: [64,64,64],
            klass: "strand"
        }),
        cartouche3 : MakeDrawerParams({
            width: 20, colour: [64,64,64],
            middlewidth: 16, middlecolour: [128,129,64],
            hilightwidth: 4, hilightcolour: [160,160,96], hilightoffset: [-1, -2],
            klass: "knot"
        }),
        cartouche_line3 : MakeDrawerParams({
            width: 3, colour: [160,160,128],
            edgethick: 1, edgecolour: [64,64,64],
            klass: "strand"
        }),
        cartouche4 : MakeDrawerParams({
            width: 20, colour: [64,64,64],
            middlewidth: 16, middlecolour: [128,64,64],
            hilightwidth: 4, hilightcolour: [160,96,96], hilightoffset: [-1, -2],
            klass: "knot"
        }),
        cartouche_line4 : MakeDrawerParams({
            width: 3, colour: [160,64,64],
            edgethick: 1, edgecolour: [64,64,64],
            klass: "strand"
        }),

        strand1 : MakeDrawerParams({
            width: 7, colour: [128,64,128],
            edgethick: 1, edgecolour: [0,0,0],
            hilightwidth: 2, hilightcolour: [255,128,196], hilightoffset: [-1, -2],
            klass: "strand"
        }),
        strand2 : MakeDrawerParams({
            width: 5, colour: [64,64,128],
            edgethick: 1, edgecolour: [0,0,0],
            hilightwidth: 1, hilightcolour: [128,128,196], hilightoffset: [-1, -2],
            klass: "strand"
        }),
        strand3 : MakeDrawerParams({
            width: 10, colour: [128,128,64],
            edgethick: 1, edgecolour: [0,0,0],
            hilightwidth: 3, hilightcolour: [196,196,128], hilightoffset: [-1.5, -3],
            klass: "strand"
        }),

        wire : MakeDrawerParams({
            width: 3, colour: [0, 0, 0],
            hilightwidth: 1, hilightcolour: [196,196,196],
            klass: "strand"
        }),
        debugwire : MakeDrawerParams({
            width: 1, colour: [255, 0, 0],
            klass: "strand"
        }),

        frame1 : MakeDrawerParams({
            width: 10, colour: [64,64,64],
            middlewidth: 6, middlecolour: [128,128,32],
            hilightwidth: 2, hilightcolour: [160,160,64],
            klass: "knot"
        }),
        frame2 : MakeDrawerParams({
            width: 10, colour: [64,64,64],
            middlewidth: 8, middlecolour: [128,32,32],
            hilightwidth: 2, hilightcolour: [160,64,64],
            klass: "knot"
        }),
        frame3 : MakeDrawerParams({
            width: 10, colour: [64,64,64],
            middlewidth: 8, middlecolour: [32,128,32],
            hilightwidth: 2, hilightcolour: [64,160,64],
            klass: "knot"
        }),
    };
});