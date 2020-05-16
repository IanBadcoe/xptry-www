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
        width : length,
        height : drawer.Width + 2,
        "transform-origin": "0 0",
        transform: "translate(" + p1.X + "px," + p1.Y + "px) "
            + "rotate(" + angle + "rad) "
            + "translate(" + -width_offset + "px," + -width_offset + "px)",
        "z-index" : Zs.Strand + 1
    });

    drawer.ForeDrawLine(svg, new Coord(0, 0), new Coord(dist, 0), "strand-inner", -angle, new Coord(-1, 0));

    return svg;
}

// a is the strands weight per unit length / the horizontal tension (e.g. tension at the low-point)
// just setting by eye, but something like 2 or 4 seems like it might work
// equation of a catenary is y = a.cosh(x/a)
// which is symmetric around zero
// to draw curve with p1 and p2 at different heights just means finding the right
// x offset so that the two sides hit the right heights at the right x values
// to find this we define:
// d = difference in height
// n = x separation
// and ask Wolfram Alpha to solve:
// d = a.(cosh(x / a) - cosh((x - n)/a)) for real x
// e.g. this means that p1 will be at (x - n, y) and p2 will be at (x, y + d):
//
//y+d                       p2
// |
// y     p1
// |
// |
// +---- x-n -------------- x -------------
//
// Wolfram gives for this:
//
// x = a log(sqrt((e^(n/a) (a^2 (e^(n/a) - 1)^2 + d^2 e^(n/a)))/(a^2 (e^(n/a) - 1)^2)) + (d e^(n/a))/(a (e^(n/a) - 1)))
// (where "log" is natural log)
//
// if we define:
// q = e^(n/a)
// then this becomes
// x = a log(sqrt((q (a^2 (q - 1)^2 + d^2 q))/(a^2 (q - 1)^2)) + (d q)/(a (q - 1)))
// and qm1 - q - 1 gives:
// x = a log(sqrt((q (a^2 (qm1)^2 + d^2 q))/(a^2 (qm1)^2)) + (d q)/(a (qm1)))
// x = a Math.log(Math.sqrt((q * (a*a * qm1*qm1 + d*d * q))/(a*a * qm1*qm1)) + (d * q)/(a * qm1)))

function DrawCatenaryStrandBetweenPoints(el, p1, p2, a, drawer, rect_only) {
    // // we'll transform everything relative to P1, because I am a bit wary of very large numbers in the maths if ew get a long way from the origin
    // let orig_p1 = p1;
    // p2 = p2.Sub(p1);
    // p1 = new Coord(0, 0);
    // // we'll put that back when positioning the svg

    let d = p2.Y - p1.Y;
    let n = p2.X - p1.X;

    let q = Math.exp(n/a);
    let qm1 = q - 1;

    // negating d in here and negating the catenary equation corrects for the Y axis being the wrong way up on-screen
    let x = a * Math.log(Math.sqrt((q * (a*a * qm1*qm1 + d*d * q)) / (a*a * qm1*qm1)) + (-d * q)/(a * qm1));
    let catenary = x => -a * Math.cosh(x / a); 

    let x_offset = x - p2.X;

    let y_offset = p2.Y - catenary(x);

    // the low point is always at -a
    let ymax = y_offset - a;
    let ymin = Math.min(p1.Y, p2.Y);
    let xmin = Math.min(p1.X, p2.X);
    let xmax = Math.max(p1.X, p2.X);

    ymin -= 10;
    ymax += 10;
    xmin -= 10;
    xmax += 10;

    if (rect_only) {
        return new Rect(xmin, ymin, xmax, ymax);
    }

    let points = [];

    let steps = Math.ceil(n / 10);

    for(let i = 0; i <= steps; i++) {
        let hx = p1.X + (n / steps) * i; 
        let hy = y_offset + catenary(hx + x_offset);
        points.push(new Coord(hx, hy));
    }

    let tl = new Coord(xmin, ymin);
    let br = new Coord(xmax, ymax);
    let centre = br.Add(tl).Div(2);
    let dims = br.Sub(tl);

    let svg = add_svg(el, centre, tl, dims, Zs.NodeContentL3).attr({
        class: "absolute zero-spacing decor"
    });

    drawer.ForeDrawPolyline(svg, points, false);

    return svg;
}