"use strict";

$(document).ready(function() {
    let _decors;
    let _threads;
    let _world_centre_x = 0;
    let _world_centre_y = 0;

    SiteNav = {
        UrlStem : stem,
        SmartScroll : function (where) {
            if (!(where in _threads))
                return;

            let dx = _threads[where].left - _world_centre_x;
            let dy = _threads[where].left - _world_centre_x;
            let target = $(where);
            let tpos = target.offset();

            $(".wants-scroll").animate({
                left: "-=" + tpos.left + "px",
                top: "-=" + tpos.centre_y + "px"
            });
        },
        SmartNav : function (where) {
            where = where || this.DefaultLocation;

            this.smart_scroll(where);

            history.pushState(where, "", this.UrlStem + "#" + where);
        },
        Init: async function(home_id) {
            this.DefaultLocation = home_id;

            let promise = RefreshNavData();

            let url = location.href;
            let sp = url.lastIndexOf("#");

            // if we don't have a location, set the home_id
            if (sp == -1) {
                url = url + "#" + home_id
                sp = url.lastIndexOf("#");
            }

            this.UrlStem = url.substr(0, sp);
            let init_loc = url.substr(sp + 1);

            // fix-up current history with the current state and possibly home_id
            history.replaceState(init_loc, "", url);

            await promise;

            // scroll to that location
            smart_scroll(init_loc);

            // listen for history navigation
            addEventListener("popstate", event => {
                this.SmartScroll(event.state);
            });
        },
        RefreshNavData: async function() {
            let promises = [];
            promises.push(
                $.ajax(
                    "{path='Ajax/decors}",
                    {
                        success: function(data, status) {
                            _decors = data;
                        },
                        dataType: "json",
                        error: ajax_error
                    }
                )
            );
            promises.push(
                $.ajax(
                    "{path='Ajax/threads}",
                    {
                        success: function(data, status) {
                            _threads = data;
                        },
                        dataType: "json",
                        error: ajax_error
                    }
                )
            );

            return Promise.all(promises);
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});