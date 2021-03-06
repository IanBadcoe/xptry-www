$(document).ready(() => {
    let fn = function(i, j) {
        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 90,
                height: 90,
                "background-color" : "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
            });

        return d;
    }

    for(let i = -500; i < 1500; i += 100) {
        for(let j = -500; j < 1500; j += 100) {
            let obj = {
                url_title: "xx" + i + "-" + j,
                load(ret_fn) {
                    ret_fn(fn(i, j));
                },
                rect: new Rect(i, j, i + 90, j + 90)
            };

            DemandLoader.Register(obj);
        }
    }

    Draggable.Set($(".scroll-container"), [$(".background")]);

    function active_rect() {
        let sc = $(".scroll-container");
        let pos = sc.position();
        pos = new Coord(pos.left, pos.top);

        let dim = new Coord(innerWidth, innerHeight);

        let rect = new Rect(pos.Inverse().Add(dim.Mult(0.4)),
            pos.Inverse().Add(dim.Mult(0.6)));

        return rect;
    }

    let rect = active_rect();
    let dims = rect.Dims();

    let hud = $(".noclick");

    let div = $("<div></div>")
        .css({
            left: rect.TL.X,
            top: rect.TL.Y,
            width: dims.X,
            height: dims.Y,
            "background-color" : "rgba(128,128,128,128)"
        }).
        addClass("absolute zero-spacing");

    hud.append(div);

    DemandLoader.Init(100, 500, 1000, active_rect);
});