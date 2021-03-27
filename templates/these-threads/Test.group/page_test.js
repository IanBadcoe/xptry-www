$(document).ready(() => {
    PSM.Init(20, $(".scroll-container-container"), 1,
        300, 100);

    let OnResize = () => {
        // auto-scale the page, but continue to respect any zoom the user has already set
        let scale = Math.min(innerHeight, innerWidth) / 700 * PSM.Zoom;

        $(".apply-scale").css({
            transform: "scale(" + scale  + ")"
        });

        PSM.SetScale(1 / scale);
    }

    window.onresize = OnResize;

    OnResize();

    let dl1 = PSM.GetDemandLoader(1.0);

    function setup_text() {
        let div_outer = $("<div/>").addClass("absolute fill click page");

        let div = $("<div/>")
            .addClass("text-container");

        div_outer.append(div);

        let title = "Poetry Description Language - 1 - strophes and font effects";

        let text =
              "Just type lines and hit enter at the end.\n"
            + "Keep doing this to add to a strophe.\n"
            + "Hit enter twice to end the strophe.\n\n"
            + "Hit enter extra times for more space after the strophe\n"
            + "(this is three).\n\n\n"
            + "Surround text in \\[b][b]these for bold[b]\\[b]\n"
            + "and \\[i][i]these for italic[i]\\[i]\n"
            + "and \\[u][u]these for underlined[u]\\[u].\n\n"
            + "Combinations give \\[b]\\[i][b][i]multiple effects at the same time.\n"
            + "They continue line\nto\nline...\n\n"
            + "...but are ended for a new strophe.\n\n\n"
            + "Apply and remove in any order:\n\n"
            + "no effect,\n\\[b][b]<--add bold,\n\\[i][i]<--add italic,\n\\[b][b]<--remove bold,\n\\[i][i]<--remove italic.\nback to no effect\n\n"
;

        PDL.FormatIntoContainer(div, title, text, "text");

        setTimeout(() => {
            let ow = div.outerWidth();
            let oh = div.outerHeight();

            let svg = add_svg(div,
                new Coord(ow, oh).Div(2),
                new Coord(0, 0), new Coord(ow, oh));

            svg.addClass("text");

            let kb = new KnotBuilder;

            const frame = Frames.TripleCross(new Coord(ow - 80, oh - 80), Drawers["frame3"], 15, new Coord(40, 40));
            Frames.AddFrameToBuilder(kb, frame, 2);
            const corner = Corners.ZigZagCrossOver(Drawers["frame2"], 0.7);
            Corners.AddCornersToBuilder(kb, corner, frame, 3);
            const middle = Middles.DoubleSquare(Drawers["frame1"], 0.9);
            Middles.AddMiddlesToBuilder(kb, middle, frame, 2);

            let knot = kb.BuildKnot();

            knot.Draw(svg);
        }, 1);

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
