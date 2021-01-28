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

    function setup() {
        var start = new Date().getTime();

        let svg = add_svg(null,
            new Coord(400, 400),
            new Coord(-100, -100), new Coord(800, 1000));

        let kb = new KnotBuilder;

        const frame1 = Frames.Double(new Coord(600, 300), Drawers["frame3"], 15);
        const frame2 = Frames.Double(new Coord(600, 300), Drawers["frame3"], 15, new Coord(0, 315));
        Frames.AddFrameToBuilder(kb, frame1, 2);
        Frames.AddFrameToBuilder(kb, frame2, 2);
        const corner1 = Corners.Square(frame1, Drawers["frame2"]);
        const corner2 = Corners.Square(frame2, Drawers["frame1"]);
        Corners.AddCornersToBuilder(kb, corner1, frame1, 2);
        Corners.AddCornersToBuilder(kb, corner2, frame2, 2);
        Corners.SpliceCorners(kb);

        let knot = kb.BuildKnot();

        knot.Draw(svg);

        console.log(new Date().getTime() - start + " ms");

        return svg;
    }

    dl1.Register({
        rect: new Rect(new Coord(0, 0), new Coord(420, 500)),
        load: ret_fn => ret_fn(setup()),
        url_title: "xx"
    });
});

