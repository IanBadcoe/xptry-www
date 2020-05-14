$(document).ready(() => {
    window.PSM.Init(200, 3000, 50, $(".scroll-container-container"), 0.8);
    let dl1 = PSM.GetDemandLoader(1.0);
    let dl2 = PSM.GetDemandLoader(1.5);
    let dl3 = PSM.GetDemandLoader(2.0);

    function fn(i, j) {
        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 50,
                height: 50,
                "background-color": "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
            });

        return d;
    }

    function make_obj(i, j) {
        return {
            rect: new Rect(new Coord(i, j), new Coord(i + 50, j + 50)),
            load: ret_fn => ret_fn(fn(i, j)),
            url_title: "xx-" + i + "-" + j
        };
    }

    for(let i = -2000; i < 4000; i += 100) {
        for(let j = -2000; j < 4000; j += 100) {
            dl1.Register(make_obj(i, j));
            dl2.Register(make_obj(i, j));
            dl3.Register(make_obj(i, j));
        }
    }
});