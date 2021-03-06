$(document).ready(function() {
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

    function spline_interp(spline, p) {
        if (p > spline.EndParam) {
            p -= spline.EndParam;
        }

        if (p < 0) {
            p += spline.EndParam;
        }

        return spline.Interp(p);
    }

    function rec_search(spline, lower_p, upper_p) {
        let range = upper_p - lower_p;

        if (range < 1.0e-16) {
            return (lower_p + upper_p) / 2;
        }

        let max_p = -1;
        // we're actually on the page, at y down to -600
        // and upside down...
        let max_a = 0;

        for(let i = 0; i <= 100; i++) {
            let p = i / 100 * range + lower_p;

            let a = spline_interp(spline, p)[1];

            if (a < max_a) {
                max_a = a;
                max_p = p;
            }
        }

        return rec_search(spline, max_p - range / 100, max_p + range / 100);
    }

    function test_one(points, order, yoffset, where) {
        let knots = MakeClampedKnotVector(points, order);

        let spline = MakeBasisView(knots, order, 600, 100, yoffset, false);

        let maxima = [];

        for(let idx = 0; idx < points; idx++) {
            spline.SetIdx(idx);

            let max_p = rec_search(spline, 0, spline.EndParam);

            maxima.push(max_p);

            add_polyline($(where), 0, spline.EndParam, 20, spline,
                'stroke:rgb(0,0,0);stroke-width:1;fill:none;stroke-linecap:butt;',
                false, 0);
        }


        for(i = 0; i < points; i++) {
            add_line($(where),
                [
                    maxima[i] * 600 / spline.EndParam, yoffset],
                    [maxima[i] * 600 / spline.EndParam, yoffset - 100
                ], 'stroke:rgb(255,0,0);stroke-width:1;fill:none;stroke-linecap:butt;');
        }

        return maxima;
    }

    let results = [];

    let yoffset = -500;

    for(let i = 4; i < 10; i++) {
        results.push(test_one(i, 3, yoffset, ".test-line"));

        yoffset += 100;
    }

    let diffs = [];

    results.forEach(result => {
        let prev = -1;

        diffs.push(result.map(val => {
            let pprev = prev;
            prev = val;

            if (pprev === -1) {
                return 0;
            } else {
                return val - pprev;
            }
        }));
    });
});
