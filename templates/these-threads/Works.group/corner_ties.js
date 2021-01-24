"use strict";

(function() {
    function make_orig_lines_data(orig_lines, target_corner) {
        let targ = orig_lines[target_corner];

        let orig_lines_edges = CornerTileUtil.MakeEdgeData(orig_lines);

        orig_lines_edges.forEach(edge => {
            if (edge.from.Equal(targ) || edge.to.Equal(targ)) {
                let delta = edge.from.Sub(edge.to);
                if (delta.X === 0 && delta.Y != 0) {
                    edge.label = "vert";
                } else if (delta.Y === 0 && delta.X != 0) {
                    edge.label = "horz"
                } else {
                    throw "bad edge";
                }
            }
        });

        return orig_lines_edges;
    }

    function edge_contains_x(edge, x) {
        return (x > edge.from.X && x < edge.to.X)
            || (x > edge.to.X && x < edge.from.X);
    }

    function edge_contains_y(edge, y) {
        return (edge.from.Y < y) === (edge.to.Y > y);
    }

    function split_edge(edges, edge, ord_val, ord_idx) {
        let edge_idx = edges.findIndex(x => x === edge);

        let new_point = new Coord(edge.to);
        new_point[ord_idx] = ord_val;

        let new_edge = {
            from: new_point,
            to: edge.to,
            label: edge.label
        }

        edge.to = new_point;

        edges.splice(edge_idx + 1, 0, new_edge);

        return new_edge;
    }

    window.CornerTileUtil = {
        // builds a corner decor tie such as:
        //
        //     +-----+
        //     | +---+---+
        //     | | +-+---+--------------- (orig line)
        //     +-+-+-+---+
        //       | | |
        //       | | |
        //       +-+-+
        //         |
        //         |
        //
        // point_data is an array of mixed types:
        // [ [x1, y1], "edge_label", [x2, y2], [x3, y3] ]
        // in this usage, edges labelled vsplit, or hsplit get split by the incoming
        // horizontal or vertical lines
        //
        // orig_lines is an array of coords:
        // [ [x1, y1], [x2, y2] ... [xn, yn] ]
        // and target_corner is the index of the entry within that which we are decorating
        // orig lines gets modified with injected verts for its new intersections with the corner's lines
        // it is assumed that only the lines before and after the target corner need this

        MakeCornerTie(point_data, orig_lines, target_corner, line_thick) {
            let tie_data = this.MakeEdgeData(point_data, true);
            let orig_data = make_orig_lines_data(orig_lines, target_corner);

            let h_orig = orig_data.filter(x => x.label === "horz");
            let v_orig = orig_data.filter(x => x.label === "vert");
            let v_orig_x = v_orig[0].from.X;
            let h_orig_y = h_orig[0].from.Y;


            // v_splits are the HORIZONTAL lines in tie_data that could get split by v_orig
            // and vice-versa
            let v_splits = [];
            let h_splits = [];

            tie_data.forEach(edge => {
                if (edge.label === "vsplit") {
                    v_splits.push(edge);
                } else if (edge.label === "hsplit") {
                    h_splits.push(edge);
                }
            });

            let tie_xs = [];
            let tie_ys = [];

            v_splits.forEach(edge => {
                if (edge_contains_x(edge, v_orig_x)) {
                    tie_ys.push(edge.from.Y);
                    split_edge(tie_data, edge, v_orig_x, 0);
                }
            });

            h_splits.forEach(edge => {
                if (edge_contains_y(edge, h_orig_y)) {
                    tie_xs.push(edge.from.X);
                    split_edge(tie_data, edge, h_orig_y, 1)
                }
            });

            tie_xs.forEach(x => {
                for(let i = 0; i < h_orig.length; i++) {
                    let edge = h_orig[i];

                    if (edge_contains_x(edge, x)) {
                        h_orig.push(split_edge(orig_data, edge, x, 0));
                    }
                }
            });

            tie_ys.forEach(y => {
                for(let i = 0; i < v_orig.length; i++) {
                    let edge = v_orig[i];

                    if (edge_contains_y(edge, y)) {
                        v_orig.push(split_edge(orig_data, edge, y, 1));
                    }
                }
            });
        },

        // creates structured edge data from an array as described as "point_data" for MakeCornerTile
        MakeEdgeData(data, closed) {
            function check_point(pt) {
                return typeof(pt) === "object" && pt.length && pt.length >= 2;
            }
            function enforce_point(pt) {
                if (!check_point(pt)) {
                    throw "bad coordinate";
                }
            }

            let curr_pt = data[0];
            let first_pt = curr_pt;
            data.splice(0, 1);

            enforce_point(curr_pt);

            let curr_label = null;
            let edges = [];

            function store_edge(pt1, pt2, label) {
                let is_v = pt1.X - pt2.X == 0;
                let is_h = pt1.Y - pt2.Y == 0;
                if (!is_h && !is_v) {
                    // although all we need for full generality is a better line-intersect routine, I think
                    throw "only orthogonal lines supported as yet";
                } else if (is_h && is_v) {
                    throw "degenerate line";
                }

                let edge = {
                    from: pt1,
                    to: pt2,
                    label: label,
                    horz: is_h
                };

                edges.push(edge);
            }

            curr_pt = new Coord(curr_pt);

            while (data.length) {
                let next_pt = data[0];
                data.splice(0, 1);

                if (!check_point(next_pt)) {
                    curr_label = next_pt;
                } else {
                    next_pt = new Coord(next_pt);
                    store_edge(curr_pt, next_pt, curr_label, edges);

                    curr_pt = next_pt;
                    curr_label = null;
                }
            }

            if (closed) {
                store_edge(curr_pt, first_pt, curr_label);
            }

            return edges;
        }
    }
})();

