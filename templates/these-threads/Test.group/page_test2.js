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

        let title = "Poetry Description Language - 2 - line/strophe positioning";

        let text =
              "Default strophes are left aligned at the margin\n\n"
            + "\\[c][c] to centre\na whole\nstrophe.\n\n"
            + "\\[r][r] to right-align\na strophe.\n\n"
            + "To tab in a line use:\n"
            + "\\[t][t] This (defaults to three em)\n\n"
            + "Add a number:\n"
            + "\\[t=1][t=1]for precise control\n"
            + "\\[t=2][t=2]of tabbing\n"
            + "\\[t=3][t=3]in emdash widths.\n\n"
            + "Feel free to tab out:\n"
            + "\\[t=-5][t=-5]using negative numbers...\n\n"
            + "...and you can also use fractions.\n"
            + "[t=0.3]to.\n"
            + "[t=0.7]get\n"
            + "[t=0.9]really\n"
            + "[t=1.0]precise.\n\n";

            Page.CreateBorderedTextPage(
                div_outer, title, text,
                "SingleExtLoop", 2, "frame3",
                "Square", 3, "frame2",
                "Square", 2, "frame1"
            );

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
