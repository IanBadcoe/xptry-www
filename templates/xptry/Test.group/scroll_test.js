$(document).ready(function () {
    var url = location.href;
    var sp = url.lastIndexOf("#");
    if (sp == -1) {
        url = url + "#home"
        sp = url.lastIndexOf("#");
    }
    var stem = url.substr(0, sp);
    var init_loc = url.substr(sp);

    function smart_scroll(where) {
        var target = $(where);
        var tpos = target.offset();

        $(".wants-scroll").animate({
            left: "-=" + tpos.left + "px",
            top: "-=" + tpos.top + "px"
        });
    }

    smart_nav = function (where) {
        where = where || "#home";

        smart_scroll(where);

        history.pushState(where, "", stem + where);
    }

    history.replaceState(init_loc, "", url);

    smart_scroll(init_loc);

    addEventListener("popstate", event => {
        smart_scroll(event.state);
    });
});