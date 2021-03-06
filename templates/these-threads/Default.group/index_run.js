$(document).ready(() => {
    window.PSM.Init(25, $(".scroll-container-container"), 1,
        600, 100);

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

    SiteNav.Init("home-knot");

    $(".click").css("z-index", Zs.UI);
    $(".noclick").css("z-index", Zs.UI);
});