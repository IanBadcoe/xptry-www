$(document).ready(function() {
    function show_one(order, closed, xoffset, yoffset, where) {
        var spline = MakeNonUniformBSpline([
            [xoffset - 50, yoffset + 50],
            [xoffset + 50, yoffset + 50],
            [xoffset + 50, yoffset - 50],
            [xoffset - 50, yoffset - 50],
        ], order, closed);

        add_polyline($(where), spline.StartParam, spline.EndParam, 10, spline,
           'stroke:rgb(255,0,255);stroke-width:2;fill:none;stroke-linecap:butt;', closed, 0);
    }

//    show_one(0, false, 100, 100, ".test-line");
    show_one(1, false, 300, 100, ".test-line");
    show_one(2, false, 100, 300, ".test-line");
    show_one(3, false, 300, 300, ".test-line");

 //   show_one(0, true, 100, 100, ".test-line2");
    show_one(1, true, 300, 100, ".test-line2");
    show_one(2, true, 100, 300, ".test-line2");
    show_one(3, true, 300, 300, ".test-line2");
});
