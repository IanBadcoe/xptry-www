$(document).ready(() => {
    // auto-scale the page, but (by using outer*, rather that inner*) continue to respect any zoom the user has already set
    let scale = Math.min(outerWidth, outerHeight) / 1800;

    $(".scroll-container-container").css({
        transform: "scale(" + scale + ")"
    });

    window.PSM.Init(200, 3000, 50, $(".scroll-container-container"), 1 / scale, 0.8);
    let dl1 = PSM.GetDemandLoader(1.0);
    let dl2 = PSM.GetDemandLoader(1.5);
    let dl3 = PSM.GetDemandLoader(2.0);

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