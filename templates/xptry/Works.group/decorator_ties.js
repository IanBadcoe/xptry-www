function MakeRadialTie(tile, centre, ang, thick, rad, width, drawer) {
    var _tile = tile;
    var _centre = centre;
    var _ang = ang;
    var _thick = thick;
    var _rad = rad;
    var _width = width;
    var _drawer = drawer;

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {
        var rad_dir = [Math.sin(_ang), -Math.cos(_ang)];
        var tang_dir = [rad_dir[1], -rad_dir[0]];

        function transform_point(p) {
            var rad = _rad + _width * p[1];
            var tang = p[0] * thick;

            return [_centre[0] + rad * rad_dir[0] + tang * tang_dir[0],
                _centre[1] + rad * rad_dir[1] + tang * tang_dir[1]];
        }

        if (front) {
            _tile.FSeqs.forEach(seq => {
                var points = [];

                seq.forEach(pnt => {
                    points.push(transform_point(pnt));
                });

                _drawer.ForeDrawPolyline(insert_element, points, false);
            });
        } else {
            _tile.BSeqs.forEach(seq => {
                var points = [];

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