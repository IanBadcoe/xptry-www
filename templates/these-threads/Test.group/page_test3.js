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

        let title = "Poetry Description Language - 3 - advanced";

        let text =
              "Repeat 1 to  4 hyphens ('-') alone on a line to add various lengths of horizontal rule:\n\\-\n--\n---\n----\n\n"
              + "or use '=' the same way for double\n=\n\n"
              + "or '.' for dotted\n.\n\n"
              + "or '#' for heavy\n#\n\n\n\n"
              + "\\[n=x,y]To nudge the position of a line away from its\nnatural position, in emdash lengths.  e.g:\n"
            + "\\[n=0,0.3][n=0,0.3] - down\n"
            + "\\[n=0,-0.3][n=0,-0.3] - up\n"
            + "\\[n=1,0][n=1,0] - right\n"
            + "\\[n=-1,0][n=-1,0] - left\n\n"
            + "\\[a=50,45][a=50,45]To just\nput\na strophe anywhere\n(in emdashes from the top left).\n\n"
            + "\\[a=15,55]\\[r][a=15,55][r]Feel free to\n[b]\\[b]use other\\[b][b]\neffects as well.\n\n";

            Page.CreateBorderedTextPage(
                div_outer, title, text,
                "TripleCross", 2, "frame3",
                "ZigZagCrossOver", 3, "frame2",
                "DoubleSquare", 2, "frame1"
            );

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
