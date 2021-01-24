$(document).ready(() => {
    PSM.Init(20, $(".scroll-container-container"), 1,
        300, 100);

    let OnResize = () => {
        // auto-scale the page, but continue to respect any zoom the user has already set
        let scale = Math.min(innerHeight, innerWidth) / 700 * PSM.Zoom;

        $(".scroll-container-container").css({
            transform: "scale(" + scale  + ")"
        });

        PSM.SetScale(1 / scale);
    }

    window.onresize = OnResize;

    OnResize();

    let dl1 = PSM.GetDemandLoader(1.0);

    function setup_corner() {
        var start = new Date().getTime();

        let svg = add_svg(null,
            new Coord(300, 400),
            new Coord(-300, -400), new Coord(600, 800));

        let end = 60;
        let inner = 30;
        let outer1 = -30
        let outer2 = -60
        let wide = -90
        let squeeze_corner = 1;

        let knot = MakeCKnot(
            [
                {
                    Drawer: Drawers["cartouche2"],
                    Step: 5,
                    Points: [ [0, 400], [0, end], [0, inner], [0, 0], [inner, 0], [end, 0], [400,0], ],
                    Open: true,
                    Order: 2
                },
                {
                    Drawer: Drawers["cartouche3"],
                    Step: 5,
                    Points: [
                        [outer2, inner], [outer1, inner], [0, inner], [inner, inner], [end, inner],
                        [end, 0],
                        [end, outer1], [inner, outer1],
                        [outer1, outer1],
                        [outer1, inner], [outer1, end],
                        [0, end],
                        [inner, end], [inner, inner], [inner, 0], [inner, outer1], [inner, outer2],
                        [outer2 * squeeze_corner, outer2 * squeeze_corner], // [wide, outer2], [wide, wide], [outer2, wide], [outer2 * squeeze_corner, outer2 * squeeze_corner],
                    ],
                    Open: false,
                    Order: 3
                },
            ]
        );

        knot.Draw(svg);

        console.log(new Date().getTime() - start + " ms");

        return svg;
    }

    dl1.Register({
        rect: new Rect(new Coord(0, 0), new Coord(420, 500)),
        load: ret_fn => ret_fn(setup_corner()),
        url_title: "xx"
    });
});
