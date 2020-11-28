$(document).ready(() => {
    PSM.Init(20, $(".scroll-container-container"), 1, 0.8);

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
    let dl2 = PSM.GetDemandLoader(2.0);
    let dl3 = PSM.GetDemandLoader(4.0);

    function fn(i, j, force_colour) {
        let colour = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";

        if (force_colour) {
            colour = "rgb(255,255,255)";
        }

        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 50,
                height: 50,
                "background-color": colour
            });

        return d;
    }

    function make_obj(i, j, force_colour) {
        return {
            rect: new Rect(new Coord(i, j), new Coord(i + 50, j + 50)),
            load: ret_fn => ret_fn(fn(i, j, force_colour)),
            url_title: "xx-" + i + "-" + j
        };
    }

    for(let i = -2000; i < 4000; i += 100) {
        for(let j = -2000; j < 4000; j += 100) {
            dl1.Register(make_obj(i, j, i == 0 || j == 0));
            dl2.Register(make_obj(i, j, i == 0 || j == 0));
            dl3.Register(make_obj(i, j, i == 0 || j == 0));
        }
    }
});