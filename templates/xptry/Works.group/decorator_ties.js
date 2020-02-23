"use strict";

function MakeRadialTie(tile, centre, ang, rad, width, drawer) {
    let _tile = tile;
    let _centre = centre;
    let _ang = ang;
    let _rad = rad;
    let _width = width;
    let _drawer = window.Drawers[drawer];
    let _thick = _drawer.Width;

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {
        let rad_dir = [Math.sin(_ang), -Math.cos(_ang)];
        let tang_dir = [rad_dir[1], -rad_dir[0]];

        function transform_point(p) {
            let rad = _rad + _width * p[1];
            let tang = p[0] * _thick;

            return [_centre[0] + rad * rad_dir[0] + tang * tang_dir[0],
                _centre[1] + rad * rad_dir[1] + tang * tang_dir[1]];
        }

        if (front) {
            _tile.FSeqs.forEach(seq => {
                let points = [];

                seq.forEach(pnt => {
                    points.push(transform_point(pnt));
                });

                _drawer.ForeDrawPolyline(insert_element, points, false);
            });
        } else {
            _tile.BSeqs.forEach(seq => {
                let points = [];

                seq.forEach(pnt => {
                    points.push(transform_point(pnt));
                });

                _drawer.BackDrawPolyline(insert_element, points, false);
            });
        }
    }

    return {
        ForeDraw: function (insert_element) {
            draw_tie(insert_element, true);
        },
        BackDraw: function (insert_element) {
            draw_tie(insert_element, false);
        }
    };
}

function MakeRadialTieFromTargetPoint(tile, centre, offset, rad, width, drawer, dest) {
    let _tile = tile;
    let _centre = centre;
    let _rad = rad;
    let _width = width;
    let _drawer = window.Drawers[drawer];
    let _thick = _drawer.Width;

    let dist = Math.sqrt(offset[0] * offset[0] + offset[1] * offset[1]);

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {
        let rad_dir = [offset[0] / dist, offset[1] / dist];
        let tang_dir = [rad_dir[1], -rad_dir[0]];

        function transform_point(p) {
            let rad = _rad + _width * p[1];
            let tang = p[0] * _thick;

            return [_centre[0] + rad * rad_dir[0] + tang * tang_dir[0],
                _centre[1] + rad * rad_dir[1] + tang * tang_dir[1]];
        }

        if (dest) {
            insert_element = add_svg_link(insert_element, dest);
        }
        if (front) {
            _tile.FSeqs.forEach(seq => {
                let points = [];

                seq.forEach(pnt => {
                    points.push(transform_point(pnt));
                });

                _drawer.ForeDrawPolyline(insert_element, points, false);
            });
        } else {
            _tile.BSeqs.forEach(seq => {
                let points = [];

                seq.forEach(pnt => {
                    points.push(transform_point(pnt));
                });

                _drawer.BackDrawPolyline(insert_element, points, false);
            });
        }
    }

    return {
        ForeDraw: function (insert_element) {
            draw_tie(insert_element, true);
        },
        BackDraw: function (insert_element) {
            draw_tie(insert_element, false);
        },
        Dest: dest
    };
}