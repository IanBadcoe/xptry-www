$(document).ready(() => {
    window.PSM.Init(25, $(".scroll-container-container"), 1,
        600, 100);

    let _scale = 0;
    let _dims = null;


    function InnerResize() {
        _scale = Math.min(outerHeight, outerWidth / 700); // * PSM.Zoom;
        _dims = new Coord(innerWidth, innerHeight);

        $(".scroll-container-container").css({
            transform: "scale(" + _scale + ")"
        });

        PSM.SetScale(1 / _scale);
    }

    let OnResize = () => {
        let pos = PSM.GetPos();

//        pos = pos.Sub(_dims.Mult(0.5));

        let old_scale = _scale;
        let old_dims = _dims;

        // auto-scale the page, but continue to respect any zoom the user has already set
        InnerResize();

        let new_pos = pos.Add(_dims.Sub(old_dims).Mult(0.5 / _scale));

        PSM.SetPos(new_pos);
        let new_new_pos = PSM.GetPos();

        console.log("scale: " + old_scale + " -> " + _scale);
        console.log("dims: (" + old_dims.X + "," + old_dims.Y + ") -> (" + _dims.X + "," + _dims.Y + ")");
        console.log("pos: (" + pos.X + "," + pos.Y + ") -> (" + new_pos.X + "," + new_pos.Y + ") -> (" + new_new_pos.X + "," + new_new_pos.Y + ")");

    }

    window.onresize = OnResize;

    InnerResize();

    SiteNav.Init("home-knot");

    $(".click").css("z-index", Zs.UI);
    $(".noclick").css("z-index", Zs.UI);
});
