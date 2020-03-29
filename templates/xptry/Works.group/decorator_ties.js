"use strict";

function MakeRadialTie(tile, centre, ang, rad, width, drawer) {
    let _tile = tile;
    let _centre = centre;
    let _ang = ang;
    let _rad = rad;
    let _width = width;
    let _drawer = Drawers[drawer];
    let _thick = _drawer.Width;

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {
        let rad_dir = new Coord(Math.sin(_ang), -Math.cos(_ang));
        let tang_dir = rad_dir.Rot90();

        function transform_point(p) {
            let rad = _rad + _width * p.Y;
            let tang = p.X * _thick;

            return new Coord(_centre.X + rad * rad_dir.X + tang * tang_dir.X,
                _centre.Y + rad * rad_dir.Y + tang * tang_dir.Y);
        }

        if (front) {
            _tile.FSeqs.forEach(seq => {
                let points = seq.map(pnt => transform_point(pnt));

                _drawer.ForeDrawPolyline(insert_element, points, false);
            });
        } else {
            _tile.BSeqs.forEach(seq => {
                let points = seq.map(pnt => transform_point(pnt));

                _drawer.BackDrawPolyline(insert_element, points, false);
            });
        }
    }

    return {
        ForeDraw(insert_element) {
            draw_tie(insert_element, true);
        },
        BackDraw(insert_element) {
            draw_tie(insert_element, false);
        }
    };
}

function GetRadialTieSPoint(tile, centre, offset, rad, width, drawer) {
    let thick = drawer.Width;

    let dist = offset.Dist();

    let rad_dir = offset.Div(dist);
    let tang_dir = rad_dir.Rot90();

    function transform_point_abs(p) {
        let h_rad = rad + width * p.Y;
        let tang = p.X * thick;

        return new Coord(centre.X + h_rad * rad_dir.X + tang * tang_dir.X,
            centre.Y + h_rad * rad_dir.Y + tang * tang_dir.Y);
    }

    return transform_point_abs(tile.CPoint);
}

function MakeRadialTieFromTargetPoint(tile, centre, offset, rad, width, drawer, dest) {
    let thick = drawer.Width;

    let dist = offset.Dist();

    let rad_dir = offset.Div(dist);
    let tang_dir = rad_dir.Rot90();

    function transform_point(p) {
        let h_rad = rad + width * p.Y;
        let tang = p.X * thick;

        return new Coord(h_rad * rad_dir.X + tang * tang_dir.X,
            h_rad * rad_dir.Y + tang * tang_dir.Y);
    }

    function transform_point_abs(p) {
        let h_rad = rad + width * p.Y;
        let tang = p.X * thick;

        return new Coord(centre.X + h_rad * rad_dir.X + tang * tang_dir.X,
            centre.Y + h_rad * rad_dir.Y + tang * tang_dir.Y);
    }

    // zero y is the inside edge of the ring, 1 the outside edge, higher is right outside
    function draw_tie(insert_element, front) {

        if (dest) {
            insert_element = add_svg_link(insert_element, dest);
        }
        if (front) {
            tile.FSeqs.forEach(seq => {
                let points = seq.map(pnt => transform_point(pnt));

                drawer.ForeDrawPolyline(insert_element, points, false);
            });
        } else {
            tile.BSeqs.forEach(seq => {
                let points = seq.map(pnt => transform_point(pnt));

                drawer.BackDrawPolyline(insert_element, points, false);
            });
        }
    }

    return {
        ForeDraw(insert_element) {
            draw_tie(insert_element, true);
        },
        BackDraw(insert_element) {
            draw_tie(insert_element, false);
        },
        Dest: dest,
        CPoint: transform_point_abs(tile.CPoint)
    };
}

function DrawStrandBetweenPoints(el, p1, p2, drawer) {
    let dp = p2.Sub(p1);
    let dist = dp.Dist();

    // we make this svg slightly longer than it need be, in case we ever want to go back to rounded end-caps
    let length = dist + drawer.Width + 2;

    let angle = Math.atan2(dp.Y, dp.X);

    let width_offset = drawer.Width / 2 + 1;

    let svg = add_svg(
        el,
        new Coord(length / 2, width_offset),
        new Coord(-width_offset, -width_offset),
        new Coord(length, drawer.Width + 2)).attr({
        class: "absolute zero-spacing decor"
    }).css({
        left: 0,
        top: 0,
        width : length + "px",
        height : drawer.Width + 2 + "px",
        "transform-origin": "0 0",
        transform: "translate(" + p1.X + "px," + p1.Y + "px) "
            + "rotate(" + angle + "rad) "
            + "translate(" + -width_offset + "px," + -width_offset + "px)",
        "z-index" : Zs.Strand + 1
    });

    drawer.ForeDrawLine(svg, new Coord(0, 0), new Coord(dist, 0), "strand-inner", -angle, new Coord(-1, 0));

    return svg;
}