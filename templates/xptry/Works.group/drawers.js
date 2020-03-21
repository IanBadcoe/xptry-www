"use strict";

$(document).ready(() => {
    // we have two optional classes incoming, one here in the setup of the drawer,
    // and another optional one on the loops defined for the knot
    // my current assumption is that appplying both is correct
    let MakeKnotDrawer = (width, colour, clearance, backcolour, width2, colour2, width3, colour3, klass) => {
        let style2 = null;
        let style3 = null;
        let bstyle = null;

        let style = {
            stroke: "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")",
            "stroke-width": width,
        };

        if (clearance) {
            bstyle = {
                stroke: "rgb(" + backcolour[0] + "," + backcolour[1] + "," + backcolour[2] + ")",
                "stroke-width": width + clearance,
            };
        }

        if (width2) {
            style2 = {
                stroke: "rgb(" + colour2[0] + "," + colour2[1] + "," + colour2[2] + ")",
                "stroke-width": width2,
            };
        }

        if (width3) {
            style3 = {
                stroke: "rgb(" + colour3[0] + "," + colour3[1] + "," + colour3[2] + ")",
                "stroke-width": width3,
            };
        }

        return {
            ForeDrawKnot(insert_element, startparam, endparam, step, knot, close, wrap, loop_klass) {
                let here_klass = klass || loop_klass;

                if (loop_klass && klass) {
                    here_klass = klass + " " + loop_klass;
                }

                add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                    style,
                    close, 1, wrap, here_klass);
                if (style2) {
                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        style2,
                        close, 2, wrap, here_klass);
                }
                if (style3) {
                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        style3,
                        close, 3, wrap, here_klass);
                }
            },
            BackDrawKnot(insert_element, startparam, endparam, step, knot, close, wrap, loop_klass) {
                if (bstyle) {
                    let here_klass = klass || loop_klass;

                    if (loop_klass && klass) {
                        here_klass = klass + " " + loop_klass;
                    }

                    add_polyline_scaled(insert_element, startparam, endparam, step, knot,
                        bstyle,
                        close, 0, wrap, here_klass);
                }
            },
            Width: width
        };
    }

    // used for strands and ties
    let MakePolylineDrawer = (width, colour, edgethick, edgecolour, hilightwidth, hilightcolour, hilightoffset, klass) => {
        let edgestyle = null;
        let hilightstyle = null;
        hilightoffset = hilightoffset || [-1, -2];

        if (edgethick) {
            edgestyle = {
                stroke: "rgb(" + edgecolour[0] + "," + edgecolour[1] + "," + edgecolour[2] + ")",
                "stroke-width": width + edgethick,
            };
        }

        if (hilightwidth) {
            hilightstyle = {
                stroke: "rgb(" + hilightcolour[0] + "," + hilightcolour[1] + "," + hilightcolour[2] + ")",
                "stroke-width": hilightwidth,
            };
        }

        let style = {
            stroke: "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")",
            "stroke-width": width,
        };

        return {
            ForeDrawPolyline(insert_element, points, close) {
                if (edgestyle) {
                    add_raw_polyline(insert_element, points, edgestyle, close, klass);
                }
                add_raw_polyline(insert_element, points, style, close, klass);
                if (hilightstyle) {
                    add_raw_polyline(insert_element, points, hilightstyle, close, klass, hilightoffset);
                }
            },
            BackDrawPolyline(insert_element, points, close) {
                if (edgestyle) {
                    add_raw_polyline(insert_element, points, edgestyle, close, klass);
                }
                add_raw_polyline(insert_element, points, style, close, klass);
            },
            ForeDrawPolylineArc(insert_element, p1, p2, radius, clockwise, largepart) {
                let h_radius = radius + this.Width / 2;
                if (edgestyle) {
                    add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, edgestyle, klass);
                }
                add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, style, klass);
                if (hilightstyle) {
                    add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, hilightstyle, klass, hilightoffset);
                }
            },
            BackDrawPolylineArc(insert_element, p1, p2, radius, clockwise, largepart) {
                let h_radius = radius + this.Width / 2;
                if (edgestyle) {
                    add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, edgestyle, klass);
                }
                add_arc(insert_element, p1, p2, h_radius, clockwise, largepart, style, klass);
            },
            Width: width + edgethick
        };
    }

    window.Drawers = {
        home_knot : MakeKnotDrawer(
            6, [255,0,0],
            2, [255,255,255],
            4, [255,255,255],
            2, [0,0,0],
            "knot"),
        home_ring : MakeKnotDrawer(
            37, [0,0,0],
            0, null,            // <-- no clearance, ring has no back-drawing anyway...
            35, [255,255,255],
            0, null,
            "knot"),

        strand1 : MakePolylineDrawer(
            7, [128,64,128],
            1, [0,0,0],
            2, [255,128,196], [-1, -2],
            "strand"
        ),
        strand2 : MakePolylineDrawer(
            5, [64,64,128],
            1, [0,0,0],
            1, [128,128,196], [-1, -2],
            "strand"
        ),
        strand3 : MakePolylineDrawer(
            10, [128,128,64],
            1, [0,0,0],
            3, [196,196,128], [-2, -3],
            "strand"
        ),
    };
});