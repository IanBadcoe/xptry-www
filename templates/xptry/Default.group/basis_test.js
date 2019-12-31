$(document).ready(function(){
    var styles = [
        'stroke:rgb(0,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(128,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(128,128,0);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(0,128,0);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(0,128,128);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(128,128,128);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(128,0,128);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(0,0,128);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(256,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
        'stroke:rgb(0,256,0);stroke-width:1;fill:none;stroke-linecap:butt;',
    ];

    function show_one(points, order, closed, where, yoffset) {
        var knots;

        if (closed) {
            knots = MakeCyclicKnotVector(points, order);
        } else {
            knots = MakeClampedKnotVector(points, order);
        }

        var spline = MakeBasisView(knots, order, 400, 100, yoffset, closed);

        var splwrapper = {
            Interp: function(x) {
                var ret = 0;

                for(var i = 0; i < spline.NumBases; i++)
                {
                    spline.SetIdx(i);

                    var c = spline.Interp(x);

                    ret += c[1] - spline.YOffset;
                }

                return [c[0], ret + spline.YOffset];
            }
        };

        for(i = 0; i < spline.NumBases; i++)
        {
            spline.SetIdx(i);

            add_polyline($(where), spline.StartParam, spline.EndParam, 10, spline,
                styles[i],
                false, 0);
        }
        add_polyline($(where), spline.StartParam, spline.EndParam, 10, splwrapper,
            styles[9],
            false, 0);

        for(i = spline.StartParam; i < spline.EndParam; i++) {
            add_line($(where), [i * 400 / spline.ParamRange, yoffset], [i * 400 / spline.ParamRange, yoffset - 100], 'stroke:rgb(255,0,0);stroke-width:1;fill:none;stroke-linecap:butt;');
        }
    }

    show_one(4, 0, false, ".test-line", -0);
    show_one(4, 1, false, ".test-line", -110);
    show_one(4, 2, false, ".test-line", -220);
    show_one(4, 3, false, ".test-line", -330);

    show_one(4, 0, true, ".test-line2", -0);
    show_one(4, 1, true, ".test-line2", -110);
    show_one(4, 2, true, ".test-line2", -220);
    show_one(4, 3, true, ".test-line2", -330);
});
