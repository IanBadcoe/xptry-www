$(document).ready(() => {
    PSM.Init(20, $(".scroll-container-container"), 1,
        300, 100);

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

    function setup_text() {
        let div = $("<div/>")
            .css({
                left: 50,
                top: 50,
                width: 400,
                height: 1000,
                position: "absolute"
            });

        let t = $("<p>Lorem ipsum dolor sit amet...</p>")
            .addClass("text title");

        div.append(t);

        let p1 = $("<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque "
                + "laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto "
                + "beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut "
                + "odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. "
                + "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, "
                + "sed quia non numquam eius modi <b>tempora incidunt</b> ut labore et dolore magnam aliquam quaerat</p>")
            .addClass("text");

        let p2 = $("<p>"
                + "voluptatem. Ut enim ad minima veniam, quis <i>nostrum exercitationem</i> ullam corporis suscipit "
                + "laboriosam, nisi ut <b><i>aliquid ex ea commodi consequatur</i></b>? Quis autem vel eum iure reprehenderit "
                + "qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum "
                + "fugiat quo voluptas nulla pariatur?</p>")
            .addClass("text");

        div.append(p1);
        div.append(p2);

        return div;
    }

    dl1.Register({
        rect: new Rect(new Coord(50, 50), new Coord(400, 1000)),
        load: ret_fn => ret_fn(setup_text()),
        url_title: "xx"
    });
});
