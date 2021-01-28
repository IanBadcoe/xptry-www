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

        const frame1 = Frames.Double(new Coord(300, 300), Drawers["frame3"], 15);
        const frame2 = Frames.Double(new Coord(300, 300), Drawers["frame3"], 15, new Coord(0, 345));
        const frame3 = Frames.Double(new Coord(300, 300), Drawers["frame3"], 15, new Coord(345, 0));
        const frame4 = Frames.Double(new Coord(300, 300), Drawers["frame3"], 15, new Coord(345, 345));
        Frames.AddFrameToBuilder(kb, frame1, 2);
        Frames.AddFrameToBuilder(kb, frame2, 2);
        Frames.AddFrameToBuilder(kb, frame3, 2);
        Frames.AddFrameToBuilder(kb, frame4, 2);

        const corner = Corners.Square(frame1, Drawers["frame2"]);
        Corners.AddCornersToBuilder(kb, corner, frame1, 3);
        Corners.AddCornersToBuilder(kb, corner, frame2, 3);
        Corners.AddCornersToBuilder(kb, corner, frame3, 3);
        Corners.AddCornersToBuilder(kb, corner, frame4, 3);
        Frames.SpliceSubset(kb, "Corner");

        const middle = Middles.Square(frame2, Drawers["frame1"]);
        Middles.AddMiddlesToBuilder(kb, middle, frame1, 1);
        Middles.AddMiddlesToBuilder(kb, middle, frame2, 1);
        Middles.AddMiddlesToBuilder(kb, middle, frame3, 1);
        Middles.AddMiddlesToBuilder(kb, middle, frame4, 1);
        Frames.SpliceSubset(kb, "Middle");

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

