"use strict";

function MakeRadialTie(tile, centre, ang, thick, rad, width, drawer) {
    let _tile = tile;
    let _centre = centre;
    let _ang = ang;
    let _thick = thick;
    let _rad = rad;
    let _width = width;
    let _drawer = drawer;

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {
        let rad_dir = [Math.sin(_ang), -Math.cos(_ang)];
        let tang_dir = [rad_dir[1], -rad_dir[0]];

        function transform_point(p) {
            let rad = _rad + _width * p[1];
            let tang = p[0] * thick;

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

                _drawer.BackDrawPolyline($(".test-line"), points, false);
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