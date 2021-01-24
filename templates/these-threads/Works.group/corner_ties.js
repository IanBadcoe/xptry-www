"use strict";

(function() {
    function edges_intersect(e1, e2) {
        let s1 = e1.to.Sub(e1.from);
        let s2 = e2.to.Sub(e2.from);

        let s = (-s1.Y * (e1.from.X - e2.from.X) + s1.X * (e1.from.Y - e2.from.Y)) / (-s2.X * s1.Y + s1.X * s2.Y);
        let t = ( s2.X * (e1.from.Y - e2.from.Y) - s2.Y * (e1.from.X - e2.from.X)) / (-s2.X * s1.Y + s1.X * s2.Y);

        if (s > 0 && s < 1 && t > 0 && t < 1)
        {
            return new Coord(e1.from.X + (t * s1.X), e1.from.Y + (t * s1.Y));
        }

        return null;
    }

    function split_edge(edges, edge, new_point) {
        let edge_idx = edges.findIndex(x => x === edge);

        let new_edge = {
            from: new_point,
            to: edge.to,
            label: edge.label,
        }

        edge.to = new_point;

        edges.splice(edge_idx + 1, 0, new_edge);

        return new_edge;
    }

    function extract_points(edges, open) {
        let points = edges.map(e => e.from);

        if (open) {
            points.push(edges[edges.length - 1].to);
        }

        return points;
    }

    window.CornerTieUtil = {
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
        // point_data and orig_lines are objects containing loop data similat to what MakeCKnot takes
        // and will be modified to accommodate the pesence of each other in the same knot:
        // e.g. such as:
        // {
        //     Drawer: Drawers["cartouche2"],
        //     Step: 5,
        //     Points: [ [0, 400], [0, 0], [400,0], ],
        //     Open: true,
        //     Order: 2
        // },
        MakeCornerTie(corner_loop, other_loops) {
            let tie_data = this.MakeEdgeData(corner_loop.Points, !corner_loop.Open);
            let other_data = other_loops.map(x => this.MakeEdgeData(x.Points, !x.Open));

            other_data.forEach(other => {
                for(let i = 0; i < other.length; i++) {
                    let other_edge = other[i];

                    for(let j = 0; j < tie_data.length; j++) {
                        let tie_edge = tie_data[j];

                        const intersection_pt = edges_intersect(other_edge, tie_edge);
                        if (intersection_pt != null) {
                            split_edge(other, other_edge, intersection_pt);

                            split_edge(tie_data, tie_edge, intersection_pt);
                        }
                    }
                }
            });

            corner_loop.Points = extract_points(tie_data, corner_loop.Open);

            for(let i = 0; i < other_data.length; i++) {
                other_loops[i].Points = extract_points(other_data[i], other_loops[i].Open);
            }
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

            let curr_pt = new Coord(data[0]);
            let first_pt = curr_pt;
            data.splice(0, 1);

            enforce_point(curr_pt);

            let curr_label = null;
            let edges = [];

            function store_edge(pt1, pt2, label) {
                let is_v = pt1.X - pt2.X == 0;
                let is_h = pt1.Y - pt2.Y == 0;
                if (is_h && is_v) {
                    throw "degenerate line";
                }

                let edge = {
                    from: pt1,
                    to: pt2,
                    label: label
                };

                edges.push(edge);
            }

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

