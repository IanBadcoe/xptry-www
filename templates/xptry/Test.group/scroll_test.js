$(document).ready(function () {
    let url = location.href;
    let sp = url.lastIndexOf("#");
    if (sp == -1) {
        url = url + "#home"
        sp = url.lastIndexOf("#");
    }
    let stem = url.substr(0, sp);
    let init_loc = url.substr(sp);

    function smart_scroll(where) {
        let target = $(where);
        let tpos = target.offset();

        $(".scroll-container").animate({
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