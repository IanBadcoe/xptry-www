"use strict";

class KnotBuilder {
    constructor() {
        this.loops = [];
        this.loop_add_count = 0;
    }

    AddLoop(loop, mirror_x, mirror_y, translation) {
        let lloop = this.ConvertLoop(loop, mirror_x, mirror_y, translation);

        this.IntersectLoop(lloop.Edges);

        this.loops.push(lloop);
    }

    ConvertLoop(loop, mirror_x, mirror_y, translation) {
        this.loop_add_count++;

        // the combination of these three should sever any link to the original
        let lloop = Object.assign({}, loop);
        lloop.Points = [ ... lloop.Points ];
        lloop.Edges = this.MakeEdgeData(lloop.Points, !lloop.Open, mirror_x, mirror_y, translation);
        delete lloop.Points;
        return lloop;
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

        function store_edge(pt1, pt2, label, loop_id) {
            let is_v = pt1.X - pt2.X == 0;
            let is_h = pt1.Y - pt2.Y == 0;
            if (is_h && is_v) {
                throw "degenerate line";
            }

            let edge = {
                from: pt1,
                to: pt2,
                label: label,
                orig_loop: loop_id,
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
                store_edge(curr_pt, next_pt, curr_label, this.loop_add_count);

                curr_pt = next_pt;
                curr_label = null;
            }
        }

        if (closed) {
            store_edge(curr_pt, first_pt, curr_label, this.loop_add_count);
        }

        return edges;
    }

    IntersectLoop(edges) {
        this.SelfIntersectEdges(edges);

        this.loops.forEach(existing => this.IntersectEdges(edges, existing.Edges));
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

                if (intersection_data.e1p < 0 || intersection_data.e1p > 1
                    || intersection_data.e2p < 0 || intersection_data.e2p > 1)
                    continue;

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

    // for checking one, newly-added edge in an otherwise known good edge array
    SelfIntersectEdge(edges, edge1) {
        for(let j = 0; j < edges.length; j++) {
            let edge2 = edges[j];

            if (edge1 === edge2)
                continue;

            const intersection_data = this.EdgeIntersectionParams(edge1, edge2);

            if (intersection_data.e1p < 0 || intersection_data.e1p > 1
                || intersection_data.e2p < 0 || intersection_data.e2p > 1)
                continue;

            // one or both of these might add a new edge behind us in the collection,
            // but the worst that will do is make is look at an edge or two twice
            if (intersection_data.e1p > 0 && intersection_data.e1p < 1) {
                this.SplitEdge(edges, edge1, intersection_data.point);
            }

            if (intersection_data.e2p > 0 && intersection_data.e2p < 1) {
                this.SplitEdge(edges, edge2, intersection_data.point);
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

                if (intersection_data.e1p < 0 || intersection_data.e1p > 1
                    || intersection_data.e2p < 0 || intersection_data.e2p > 1)
                    continue;

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

    // for the moment splices provided loop into the last added loop we already have, if we need finer control
    // than that will have to think up a cleverer signature for this
    //
    // splices the two loops by:
    // - identify edges with the given label in both loops
    // - select the closest pair of those
    // - remove the label
    // - reverse one loop if that will give shorter new connections
    // - reconnect the edges to each-other's "to"..
    //
    // e.g.
    //      +<---+
    //      |    |
    //      +===>+
    //
    //      +===>+
    //      |    |
    //      +<---+
    //
    // needs a reversal as connecting those two edges diagonally would be longer:
    //      +<---+
    //      |    |
    //      +===>+
    //
    //      +<===+
    //      |    |
    //      +--->+
    //
    // reconnect:
    //      +<---+
    //      |    |
    //      +===>+
    //
    //      +<===+
    //      |    |
    //      +--->+
    //
    // final:
    //      +<---+
    //      |    |
    //      +    +
    //      |    |
    //      +    +
    //      |    |
    //      +--->+
    //
    // no threshold here, because the idea is we do this when we know there is at least one valid splice
    Splice(loop, label, mirror_x, mirror_y, translation) {
        let loop1 = this.ConvertLoop(loop, mirror_x, mirror_y, translation);
        let loop2 = this.loops[this.loops.length - 1];

        if (loop1.Open || loop2.Open) {
            throw "open loop splices not supported"
            // although we could support 1 quite easily, but we'd have to make sure the open loop was
            // loop1 when we splice everything together at the end...
        }

        this.IntersectLoop(loop1.Edges);

        let edges1 = loop1.Edges.filter(x => x.label == label);
        let edges2 = loop2.Edges.filter(x => x.label == label);

        if (edges1.length == 0 || edges2.length == 0) {
            throw "no candidate edges in one or both loops";
        }

        let edge1 = null;
        let edge2 = null;
        let min_dist = null;
        let needs_reverse = false;

        edges1.forEach(e1 => {
            edges2.forEach(e2 => {
                let dist = Math.min(e1.to.Dist2(e2.from) + e1.from.Dist2(e2.to));

                if (min_dist === null || dist < min_dist) {
                    edge1 = e1;
                    edge2 = e2;

                    needs_reverse = false;
                    min_dist = dist;
                }

                dist = Math.min(e1.from.Dist2(e2.from) + e1.to.Dist2(e2.to));

                if (min_dist === null || dist < min_dist) {
                    edge1 = e1;
                    edge2 = e2;

                    needs_reverse = true;
                    min_dist = dist;
                }
            });
        });

        if (needs_reverse) {
            this.ReverseEdges(loop1.Edges);
        }

        // if there are remaining labelled edges that once were one, remerge them
        // this is safe as (a) we are moving/reinserting this edge in a bit, and
        // (b) nothing below here makes assumptions about what edges are in the loops
        this.MergeAnyAdjacentEdges(loop1.Edges, edges1, edge1);
        this.MergeAnyAdjacentEdges(loop2.Edges, edges2, edge2);

        edge1.label = null;
        edge2.label = null;

        let where1 = loop1.Edges.findIndex(edge => edge === edge1);
        let where2 = loop2.Edges.findIndex(edge => edge === edge2);

        // swap the two edges destinations
        [edge1.to, edge2.to] = [edge2.to, edge1.to];

        // we have one loop of edges now, but scattered between the two Edge arrays
        // in the two original loops now do the harder part of getting it all in the right order...

        // we have:
        // l1start -> edge1 -> l1end -> [loops]
        // l2start -> edge2 -> l1end -> [loops]
        // we are going to make:
        // l1start -> edge1 -> l2end -> l2start -> edge2 -> l1end -> [loops]

        let l1start = loop1.Edges.slice(0, where1 + 1);
        let l2start = loop2.Edges.slice(0, where2 + 1);
        let l1end = loop1.Edges.slice(where1 + 1);
        let l2end = loop2.Edges.slice(where2 + 1);

        loop2.Edges = [ ...l1start, ...l2end, ...l2start, ...l1end, ];

        // we may just have generated new intersections
        this.loops.forEach(loop => this.SelfIntersectEdge(loop.Edges, edge1));
        this.loops.forEach(loop => this.SelfIntersectEdge(loop.Edges, edge2));
    }

    // takes (typically) the output of multiple splices (the last entry in loops)
    // and merges any remaining spliceable edges
    // (provided they are not from the same original loop)
    InternalSplice(label, threshold) {
        threshold = threshold || 1000000;

        let loop = this.loops[this.loops.length - 1];

        if (loop.Open) {
            throw "open loop splices not supported"
            // although we could support 1 quite easily, but we'd have to make sure the open loop was
            // loop1 when we splice everything together at the end...
        }

        let edges = loop.Edges.filter(x => x.label == label);

        if (edges.length < 2) {
            return false;
        }

        let edge1 = null;
        let edge2 = null;
        let min_dist = null;

        const comb_thres = 2 * threshold * threshold;

        for(let i = 0; i < edges.length - 1; i++) {
            let e1 = edges[i];

            for(let j = i + 1; j < edges.length; j++) {
                let e2 = edges[j];

                if (e2.orig_loop === e1.orig_loop)
                    continue;

                let dist = Math.min(e1.to.Dist2(e2.from) + e1.from.Dist2(e2.to));

                if (dist > comb_thres)
                    continue;

                if (min_dist === null || dist < min_dist) {
                    edge1 = e1;
                    edge2 = e2;

                    min_dist = dist;
                }
            }
        }

        if (!edge1) {
            return false;
        }

        // if there are remaining labelled edges that once were one, remerge them
        // this is safe as (a) we are moving/reinserting this edge in a bit, and
        // (b) nothing below here makes assumptions about what edges are in the loops
        this.MergeAnyAdjacentEdges(loop.Edges, edges, edge1);
        this.MergeAnyAdjacentEdges(loop.Edges, edges, edge2);

        edge1.label = null;
        edge2.label = null;

        // because of how we found the edges, where2 is always the greater index
        let where1 = loop.Edges.findIndex(edge => edge === edge1);
        let where2 = loop.Edges.findIndex(edge => edge === edge2);

        // swap the two edges destinations
        [edge1.to, edge2.to] = [edge2.to, edge1.to];

        this.SelfIntersectEdge(loop.Edges, edge1);
        this.SelfIntersectEdge(loop.Edges, edge2);

        // we have two loops of edges now, but jammed into one Edge array
        // in the original loop now do the harder part pulling that apart

        // we have:
        // l1end -> edge1 -> [loops- to l1start] l2start -> edge2 -> [loops to l2start] -> l1start
        // we are going to make:
        // l1start -> l1end -> edge1 -> [loops]
        // l2start -> edge2 -> [loops]

        let l1start = loop.Edges.slice(where2 + 1);
        let l2start = loop.Edges.slice(where1 + 1, where2 + 1);
        let l1end = loop.Edges.slice(0, where1 + 1);

        let new_loop = Object.assign({}, loop);
        loop.Edges = [ ...l2start ];

        new_loop.Edges = [ ...l1start, ...l1end ];

        // recurse looking for more splices
        this.InternalSplice(label, threshold);

        this.IntersectLoop(new_loop.Edges);
        this.loops.push(new_loop);

        // recurse looking for more splices on other half
        this.InternalSplice(label, threshold);
    }

    MergeAnyAdjacentEdges(all_edges, considered_edges, seed_edge) {
        let se_dir = seed_edge.to.Sub(seed_edge.from).ToUnit();

        function remove_item(arry, item) {
            let where = arry.findIndex(x => x === item);
            arry.splice(where, 1);
        }

        let any_found;

        do {
            any_found = false;

            for(let i = 0; i < considered_edges.length; i++) {
                let edge = considered_edges[i];
                if (edge !== seed_edge) {
                    if (edge.to === seed_edge.from) {
                        if (edge.to.Sub(edge.from).ToUnit().Equal(se_dir)) {
                            seed_edge.from = edge.from;
                            remove_item(all_edges, edge);
                            any_found = true;
                            break;
                        }
                    }

                    if (edge.from === seed_edge.to) {
                        if (edge.to.Sub(edge.from).ToUnit().Equal(se_dir)) {
                            seed_edge.to = edge.to;
                            remove_item(all_edges, edge);
                            any_found = true;
                            break;
                        }
                    }
                }
            }
        } while (any_found);
    }

    ReverseEdges(edges) {
        edges.reverse();
        edges.forEach(edge => [edge.from, edge.to] = [edge.to, edge.from]);
    }
}