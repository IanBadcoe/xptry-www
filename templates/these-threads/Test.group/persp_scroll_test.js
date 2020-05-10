$(document).ready(function () {
    window.Begin = function() {
        let url = location.href;
        let sp = url.lastIndexOf("#");
        if (sp === -1) {
            url = url + "#xx-0-0"
            sp = url.lastIndexOf("#");
        }
        let stem = url.substr(0, sp);
        let init_loc = url.substr(sp + 1);

        function smart_scroll(where) {
            let target = $("." + where);
            let tpos = target.offset();

            DraggablePersp.Get(1.0).animate({
                left: "-=" + (tpos.left - innerWidth / 2),
                top: "-=" + (tpos.top - innerHeight / 2)
            }, {
                step: DraggablePersp.Refresh
            });
        }

        smart_nav = function (where) {
            where = where || "xx-0-0";

            smart_scroll(where);

            history.pushState(where, "", stem + "#" + where);
        }

        history.replaceState(init_loc, "", url);

        smart_scroll(init_loc);

        addEventListener("popstate", event => {
            smart_scroll(event.state);
        });
    }
});