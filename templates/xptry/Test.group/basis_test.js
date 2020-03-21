$(document).ready(function(){
    let styles = [
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
        let knots;

        if (closed) {
            knots = MakeCyclicKnotVector(points, order);
        } else {
            knots = MakeClampedKnotVector(points, order);
        }

        let spline = MakeBasisView(knots, order, 400, 100, yoffset, closed);

        let splwrapper = {
            Interp(x) {
                let ret = 0;

                for(let i = 0; i < spline.NumBases; i++)
                {
                    spline.SetIdx(i);

                    let c = spline.Interp(x);

                    ret += c[1] - spline.YOffset;
                }

                return [c[0], ret + spline.YOffset];
            }
        };

        for(i = 0; i < spline.NumBases; i++)
        {
            spline.SetIdx(i);

            add_polyline($(where), 0, spline.EndParam, 20, spline,
                styles[i],
                false, 0);
        }
        add_polyline($(where), 0, spline.EndParam, 20, splwrapper,
            styles[9],
            false, 0);

        for(i = 0; i < spline.EndParam; i += 0.1) {
            add_line($(where), [i * 400 / spline.EndParam, yoffset], [i * 400 / spline.EndParam, yoffset - 100], 'stroke:rgb(255,0,0);stroke-width:1;fill:none;stroke-linecap:butt;');
        }
    }

    show_one(10, 0, false, ".test-line", -0);
    show_one(10, 1, false, ".test-line", -110);
    show_one(10, 2, false, ".test-line", -220);
    show_one(10, 3, false, ".test-line", -330);

    show_one(10, 0, true, ".test-line2", -0);
    show_one(10, 1, true, ".test-line2", -110);
    show_one(10, 2, true, ".test-line2", -220);
    show_one(10, 3, true, ".test-line2", -330);
});
