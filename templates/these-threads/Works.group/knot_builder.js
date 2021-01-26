"use strict";

class KnotBuilder {
    constructor() {
        this.loops = [];
    }

    AddLoop(loop, mirror_x, mirror_y, translation) {
        // the combination of these three should sever any link to the original
        let lloop = Object.assign({}, loop);
        lloop.Edges = this.MakeEdgeData(lloop.Points, !lloop.Open, mirror_x, mirror_y, translation);
        delete lloop.Points;

        this.SelfIntersectEdges(lloop.Edges);

        this.loops.forEach(existing => this.IntersectEdges(lloop.Edges, existing.Edges));

        this.loops.push(lloop);
    }

    // creates structured edge data from an array as described as "point_data" for MakeCornerTile
    MakeEdgeData(data, closed, mirror_x, mirror_y, translation) {
        translation = translation || new Coord(0, 0);

        function check_point(pt) {
            return typeof(pt) === "object" && pt.length && pt.length >= 2;
        }
        function enforce_point(pt) {
            if (!check_point(pt)) {
                throw "bad coordinate";
            }
        }
        function make_point(arry) {
            let point = new Coord(arry);
            if (mirror_x) point = point.MirrorX();
            if (mirror_y) point = point.MirrorY();
            return point.Add(translation);
        }

        let curr_pt = make_point(data[0]);
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
                next_pt = make_point(next_pt);
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

    SelfIntersectEdges(edges) {
        // although these loops can add to the collections they are looping over, they can only
        // add in the space ahead of the current edge
        //
        // for the outer loop this is fine
        // the inner loop may get the whole collection pushed forward under it when the outer loop adds one
        // but we should be able to accommodate that
        for(let i = 0; i < edges.length - 1; i++) {
            let edge1 = edges[i];

            for(let j = i + 1; j < edges.length; j++) {
                let edge2 = edges[j];

                const intersection_data = this.EdgeIntersectionParams(edge1, edge2);
                if (intersection_data.e1p > 0 && intersection_data.e1p < 1) {
                    this.SplitEdge(edges, edge1, intersection_data.point);
                }

                if (intersection_data.e2p > 0 && intersection_data.e2p < 1) {
                    this.SplitEdge(edges, edge2, intersection_data.point);

                    // the collection has had one item added behind j and one ahead of it, so we need to move it on one
                    // i is behind both the additions
                    j++;
                }
            }
        }
    }

    IntersectEdges(edges1, edges2) {
        if (edges1 === edges2) {
            throw "use SelfIntersectEdges"
        }

        // although we add to the collections as we loop, we only do that ahead of the insertion point,
        // so the loops don't need to know apart from the increate in edgesX.length
        for(let i = 0; i < edges1.length; i++) {
            let edge1 = edges1[i];

            for(let j = 0; j < edges2.length; j++) {
                let edge2 = edges2[j];

                const intersection_data = this.EdgeIntersectionParams(edge1, edge2);
                if (intersection_data.e1p > 0 && intersection_data.e1p < 1) {
                    this.SplitEdge(edges1, edge1, intersection_data.point);
                }

                if (intersection_data.e2p > 0 && intersection_data.e2p < 1) {
                    this.SplitEdge(edges2, edge2, intersection_data.point);
                }
            }
        }
    }

    EdgeIntersectionPoint(e1, e2) {
        let d1 = e1.to.Sub(e1.from);
        let d2 = e2.to.Sub(e2.from);

        let i2 = (-d1.Y * (e1.from.X - e2.from.X) + d1.X * (e1.from.Y - e2.from.Y)) / (-d2.X * d1.Y + d1.X * d2.Y);
        let i1 = ( d2.X * (e1.from.Y - e2.from.Y) - d2.Y * (e1.from.X - e2.from.X)) / (-d2.X * d1.Y + d1.X * d2.Y);

        if (i2 > 0 && i2 < 1 && i1 > 0 && i1 < 1)
        {
            return e1.from.Add(d1.Mult(i1));
        }

        return null;
    }

    // allows the caller to use a more nuanced definition of "intersecting"
    EdgeIntersectionParams(e1, e2) {
        let d1 = e1.to.Sub(e1.from);
        let d2 = e2.to.Sub(e2.from);

        let i2 = (-d1.Y * (e1.from.X - e2.from.X) + d1.X * (e1.from.Y - e2.from.Y)) / (-d2.X * d1.Y + d1.X * d2.Y);
        let i1 = ( d2.X * (e1.from.Y - e2.from.Y) - d2.Y * (e1.from.X - e2.from.X)) / (-d2.X * d1.Y + d1.X * d2.Y);

        return {
            e1p: i1,
            e2p: i2,
            d1: d1,
            d2: d2,
            point: e1.from.Add(d1.Mult(i1))
        }
    }

    SplitEdge(edges, edge, new_point) {
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

    ExtractPoints(edges, open) {
        let points = edges.map(e => e.from);

        if (open) {
            points.push(edges[edges.length - 1].to);
        }

        return points;
    }

    Build() {
        let ret = this.loops.map(x => {
            let nl = Object.assign({}, x)
            nl.Points = this.ExtractPoints(x.Edges, x.Open);
            delete nl.Edges;

            return nl;
        });

        return ret;
    }
}