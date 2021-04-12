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
