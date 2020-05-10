$(document).ready(() => {
    DraggablePersp.Init($(".scroll-container-container"), $("body"));
    let p3 = DraggablePersp.Get(3.0);
    let p1 = DraggablePersp.Get(1.0);
    let p2 = DraggablePersp.Get(2.0);

    let fn = function(i, j) {
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

    let fn2 = function(i, j) {
        let klass = "xx-" + i + "-" + j;
        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 50,
                height: 50,
                "background-color": "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
            })
            .attr({
                "onclick": "smart_nav('" + klass + "')"
            }).
            addClass(klass);

        return d;
    }

    for(let i = -500; i < 1500; i += 100) {
        for(let j = -500; j < 1500; j += 100) {
            p1.append(fn2(i, j));
            p2.append(fn(i, j));
            p3.append(fn(i, j));
        }
    }

    window.Begin();
});