$(document).ready(() => {
    Draggable.Set($(".scroll-container"), [$(".background")]);

    SiteNav.Init("home-knot");

    $(".hud-click").css("z-index", Zs.UI);
    $(".hud-noclick").css("z-index", Zs.UI);

    function active_rect() {
        let sc = $(".scroll-container");
        let pos = sc.position();
        pos = new Coord(pos.left, pos.top);

        let dim = new Coord(innerWidth, innerHeight);

        let rect = new Rect(pos.Inverse(),
            pos.Inverse().Add(dim));

        return rect.ExtendedBy(dim.Mult(0.5));
    }

    DemandLoader.Init(200, 300000, 5000, active_rect);
});