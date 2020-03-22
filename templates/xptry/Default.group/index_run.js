$(document).ready(() => {
    Draggable.Set($(".scroll-container"), [$(".background")]);

    window.SiteNav.Init("home-knot");

    $(".hud-click").css("z-index", Zs.UI);
    $(".hud-noclick").css("z-index", Zs.UI);
});