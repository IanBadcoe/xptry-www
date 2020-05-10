$(document).ready(() => {
    DraggablePersp.Init($(".scroll-container-container"), $("body"));
    let p10 = DraggablePersp.Get(10.0);
    let p1 = DraggablePersp.Get(1.0);
    let p2 = DraggablePersp.Get(2.0);

    let fn = function(i, j) {
        let d = $("<div></div>")
            .addClass("absolute zero-spacing")
            .css({
                left: i,
                top: j,
                width: 90,
                height: 90,
                "background-color": "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
            });

        return d;
    }

    for(let i = -500; i < 1500; i += 100) {
        for(let j = -500; j < 1500; j += 100) {
            p1.append(fn(i, j));
            p2.append(fn(i, j));
            p10.append(fn(i, j));
        }
    }
});