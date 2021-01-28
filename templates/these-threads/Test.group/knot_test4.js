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
            new Coord(400, 400),
            new Coord(-400, -400), new Coord(800, 800));

        let other_loop1 =
        {
            Drawer: Drawers["cartouche2"],
            Step: 5,
            Points: [ [0, 400], [0, 49], [400, 49], ],
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
            Drawer: Drawers["cartouche4"],
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
                    [100, 75], [100, -25], "splice", [125, -25], [125, 75], [150, 75], [150, -25], "splice", [175, -25], [175, 100], [125, 100],
//                    [100, 100],
                    [75, 100], [-25, 100], "splice", [-25, 125], [75, 125], [75, 150], [-25, 150], "splice", [-25, 175], [100, 175], [100, 125],
//                    [100, 100],
                ],
            Open: false,
            Order: 3
        };

        let kb = new KnotBuilder;

        kb.AddLoop(other_loop1);
        kb.AddLoop(other_loop2);
        kb.AddLoop(other_loop3);
        kb.AddLoop(other_loop1, false, true, new Coord(0, -120));
        kb.AddLoop(other_loop2, false, true, new Coord(0, -120));
        kb.AddLoop(other_loop3, false, true, new Coord(0, -120));
        kb.AddLoop(other_loop1, true, true, new Coord(-120, -120));
        kb.AddLoop(other_loop2, true, true, new Coord(-120, -120));
        kb.AddLoop(other_loop3, true, true, new Coord(-120, -120));
        kb.AddLoop(other_loop1, true, false, new Coord(-120, 0));
        kb.AddLoop(other_loop2, true, false, new Coord(-120, 0));
        kb.AddLoop(other_loop3, true, false, new Coord(-120, 0));
        let cl1 = kb.AddLoop(corner_loop);
        let cl2 = kb.AddLoop(corner_loop, false, true, new Coord(0, -120));
        let cl3 = kb.AddLoop(corner_loop, true, true, new Coord(-120, -120));
        let cl4 = kb.AddLoop(corner_loop, true, false, new Coord(-120, 0));

        kb.Splice(cl1, cl2, "splice", 80,);
        kb.Splice(cl1, cl3, "splice", 80);
        kb.Splice(cl1, cl4, "splice", 80);
        kb.InternalSplice(cl1, "splice", 80);

        let knot = kb.BuildKnot();

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

        // let test_loop =
        // {
        //     Drawer: Drawers["cartouche3"],
        //     Step: 5,
        //     Points:
        //         [ [0, 0], [10, 0], [10, 20], [20, 20], [20, 10], [0, 10] ],
        //     Open: false,
        //     Order: 3
        // };

//         let other_loop0 =
//         {
//             Drawer: Drawers["cartouche2"],
//             Step: 5,
//             Points: [ [0, 400], [0, 0], [400, 0], ],
//             Open: true,
//             Order: 2
//         }
//         let other_loop1 =
//         {
//             Drawer: Drawers["cartouche2"],
//             Step: 5,
//             Points: [ [0, 400], [0, 49], [400, 49], ],
//             Open: true,
//             Order: 2
//         }

//         let other_loop2 =
//         {
//             Drawer: Drawers["cartouche2"],
//             Step: 5,
//             Points: [ [50, 400], [50, 0], [400, 0], ],
//             Open: true,
//             Order: 2
//         };

//         let other_loop3 =
//         {
//             Drawer: Drawers["cartouche4"],
//             Step: 5,
//             Points: [ [25, 400], [25, 25], [400, 25], ],
//             Open: true,
//             Order: 2
//         };

//         let corner_loop =
//         {
//             Drawer: Drawers["cartouche3"],
//             Step: 5,
//             Points:
//                 [
//                     [100, 75], [100, -25], [125, -25], [125, 75], [150, 75], [150, -25], [175, -25], [175, 100], [125, 100],
// //                    [100, 100],
//                     [75, 100], [-25, 100], [-25, 125], [75, 125], [75, 150], [-25, 150], [-25, 175], [100, 175], [100, 125],
// //                    [100, 100],
//                 ],
//             Open: false,
//             Order: 3
//         };

//         let kb = new KnotBuilder;

//         kb.AddLoop(corner_loop);
//         kb.AddLoop(other_loop0);
//         kb.AddLoop(other_loop1, true, false, new Coord(50, 0));
//         kb.AddLoop(other_loop2, false, true, new Coord(0, 50));
//         kb.AddLoop(other_loop3);
