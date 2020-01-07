$(document).ready(function(){
    function show_one(order, closed, yoffset, where) {
        var styles = [
            'stroke:rgb(0,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
            'stroke:rgb(128,0,0);stroke-width:2;fill:none;stroke-linecap:butt;',
            'stroke:rgb(128,128,0);stroke-width:1;fill:none;stroke-linecap:butt;',
            'stroke:rgb(0,128,0);stroke-width:2;fill:none;stroke-linecap:butt;',
            'stroke:rgb(0,128,128);stroke-width:1;fill:none;stroke-linecap:butt;',
            'stroke:rgb(128,128,128);stroke-width:2;fill:none;stroke-linecap:butt;',
            'stroke:rgb(128,0,128);stroke-width:1;fill:none;stroke-linecap:butt;',
            'stroke:rgb(0,0,128);stroke-width:2;fill:none;stroke-linecap:butt;',
            'stroke:rgb(256,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
            'stroke:rgb(0,256,0);stroke-width:2;fill:none;stroke-linecap:butt;',
        ];

        var points = [
            [100,  25 + yoffset],
            [75,   25 + yoffset],
            [0,     0 + yoffset],
            [-75, -25 + yoffset],
            [-100,-25 + yoffset],
            [-100, 25 + yoffset],
            [-75,  25 + yoffset],
            [0,     0 + yoffset],
            [75,  -25 + yoffset],
            [100, -25 + yoffset],
        ];

        var spline = MakeParamScaler(MakeNonUniformBSpline(
            points,
            order,
            closed));

        for(var i = 0; i < points.length; i++) {
            var f = spline.Point2Param(i);
            var t = spline.Point2Param(i + 1);

            add_polyline_scaled($(where), f, t, 10, spline, styles[i], false, 0, closed);
        }
    }

    show_one(1, false, -100, ".test-line");
    show_one(2, false,  -40, ".test-line");
    show_one(3, false,   20, ".test-line");
    show_one(4, false,   80, ".test-line");

    show_one(1, true, -100, ".test-line2");
    show_one(2, true,  -40, ".test-line2");
    show_one(3, true,   20, ".test-line2");
    show_one(4, true,   80, ".test-line2");
});
