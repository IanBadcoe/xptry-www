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
              "\\[n=x,y]To nudge the position of a line away from its natural position, again in emdashes.  e.g:\n"
            + "\\[n=0,0.3][n=0,0.3] - down\n"
            + "\\[n=0,-0.3][n=0,-0.3] - up\n"
            + "\\[n=1,0][n=1,0] - right\n"
            + "\\[n=-1,0][n=-1,0] - left\n\n"
            + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n--\n\n"
            + "\\[a=20,20][a=20,20]To just\nput\na strophe anywhere\n(in emdashes from the top left).\n\n"
            + "\\[a=30,20]\\[r][a=30,30][r]Feel free to\nuse other\neffects as well.\n\n";

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
