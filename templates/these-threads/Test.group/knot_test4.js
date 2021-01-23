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

    function setup_cartouche() {
        var start = new Date().getTime();

        let svg = add_svg(null,
            new Coord(300, 400),
            new Coord(-250, -350), new Coord(500, 700));

        let drawer = Drawers["cartouche2"];
        let line_thick = drawer.Width;

        let tie1 = MakeRadialTieFromTargetPoint(Ties.radial1,
            new Coord(0, 0),
            new Coord(-1, -0.1),
            195 - line_thick / 2 - 2, line_thick, Drawers.wire,
            "#bob");
        let tie2 = MakeRadialTieFromTargetPoint(Ties.radial1,
            new Coord(0, 0),
            new Coord(1, -0.1),
            195 - line_thick / 2 - 2, line_thick, Drawers.wire,
            "#bob2");

        let knot = MakeCartouche(195, drawer, [tie1, tie2], 25, 25);
        knot.Draw(svg);

        console.log(new Date().getTime() - start + " ms");

        return svg;
    }

    dl1.Register({
        rect: new Rect(new Coord(0, 0), new Coord(420, 500)),
        load: ret_fn => ret_fn(setup_cartouche()),
        url_title: "xx"
    });
});
