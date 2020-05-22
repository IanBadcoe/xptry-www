$(document).ready(() => {
    let scale = Math.min(innerWidth, innerHeight) / 1100;

    window.PSM.Init(200, 300000, 5000, $(".scroll-container-container"), 1 / scale);

    $(".scroll-container-container").css({
        transform: "scale(" + scale + ")"
    });

    SiteNav.Init("home-knot");

    $(".hud-click").css("z-index", Zs.UI);
    $(".hud-noclick").css("z-index", Zs.UI);
});