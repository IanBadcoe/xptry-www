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

        let other_loop1 =
        {
            Drawer: Drawers["cartouche2"],
            Step: 5,
            Points: [ [0, 400], [0, 50], [400, 50], ],
            Open: true,
            Order: 2
        }

        let other_loop2 =
        {
            Drawer: Drawers["cartouche2"],
            Step: 5,
            Points: [ [50, 400], [50, 0], [400, 0], ],
            Open: true,
            Order: 2
        };

        let other_loop3 =
        {
            Drawer: Drawers["cartouche1"],
            Step: 5,
            Points: [ [25, 400], [25, 25], [400, 25], ],
            Open: true,
            Order: 2
        };

        let corner_loop =
        {
            Drawer: Drawers["cartouche3"],
            Step: 5,
            Points:
                [
                    [100, 75], [100, -25], [125, -25], [125, 75], [150, 75], [150, -25], [175, -25], [175, 100], [125, 100],
                    [100, 100],
                    [75, 100], [-25, 100], [-25, 125], [75, 125], [75, 150], [-25, 150], [-25, 175], [100, 175], [100, 125],
                    [100, 100],
                ],
            Open: false,
            Order: 3
        };
        // let corner_loop =
        // {
        //     Drawer: Drawers["cartouche3"],
        //     Step: 5,
        //     Points:
        //         [
        //             [ -30, -30 ],
        //             [100, -50], [100, 75], [125, 75], [125, -25], [150, -25],
        //             [150, 150],
        //             [-25, 150], [-25, 125], [75, 125], [75, 100], [-50, 100]
        //         ],
        //     Open: false,
        //     Order: 3
        // };


        CornerTieUtil.MakeCornerTie(other_loop1, [ other_loop2 ]);
        CornerTieUtil.MakeCornerTie(other_loop3, [ other_loop1, other_loop2 ]);

        CornerTieUtil.MakeCornerTie(corner_loop, [ other_loop1, other_loop2, other_loop3 ]);

        let knot = MakeCKnot(
            [
                other_loop1,
                other_loop2,
                other_loop3,
                corner_loop
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
