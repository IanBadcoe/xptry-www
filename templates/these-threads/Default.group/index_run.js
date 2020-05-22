$(document).ready(() => {
    // auto-scale the page, but continue to respect any zoom the user has already set
    let zoom = window.outerWidth / window.document.documentElement.clientWidth
    let scale = Math.min(innerWidth, innerHeight) / 1100 * zoom;

    window.PSM.Init(200, 300000, 5000, $(".scroll-container-container"), 1 / scale);

    $(".scroll-container-container").css({
        transform: "scale(" + scale + ")"
    });

    SiteNav.Init("home-knot");

    $(".hud-click").css("z-index", Zs.UI);
    $(".hud-noclick").css("z-index", Zs.UI);
});