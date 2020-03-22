$(document).ready(() => {
    let fn = function(i, j) {
        let sc = $(".scroll-container");

        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 90,
                height: 90,
                "background-color": "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
            });

        sc.append(d);

        return d;
    }

    for(let i = -500; i < 1500; i += 100) {
        for(let j = -500; j < 1500; j += 100) {
            let id = "xx" + i + ":" + j;

            DemandLoader.Register(
                id,
                new Rect(i, j, i + 90, j + 90),
                () => fn(i, j)
            );
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

    let hud = $(".hud-noclick");

    let div = $("<div></div>")
        .css({
            left: rect.tl.X + "px",
            top: rect.tl.Y + "px",
            width: dims.X + "px",
            height: dims.Y + "px",
            "background-color" : "rgba(128,128,128,128)"
        }).
        addClass("absolute zero-spacing");

    hud.append(div);

    DemandLoader.Init(100, 500, 1000, active_rect);
});