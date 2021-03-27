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
            .css({
                left: 50,
                top: 50,
                bottom: 50,
                right: 50,
                position: "absolute"
            });

        div_outer.append(div);

        let t = $("<p>Poetry Description Language - 3 - advanced</p>")
            .addClass("text title");

        div.append(t);

        let text =
              "\\[n=x,y]To nudge the position of a line away from its natural position, again in emdashes.  e.g:\n"
            + "\\[n=0,0.3][n=0,0.3] - down\n"
            + "\\[n=0,-0.3][n=0,-0.3] - up\n"
            + "\\[n=1,0][n=1,0] - right\n"
            + "\\[n=-1,0][n=-1,0] - left\n\n"
            + "\\[a=10,20][a=10,20]To just\nput\na strophe anywhere\n(in emdashes from the top left).\n\n"
            + "\\[a=30,20]\\[r][a=30,20][r]Feel free to\nuse other\neffects as well.\n\n";

        PDL.FormatIntoContainer(div, text, "text");

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
