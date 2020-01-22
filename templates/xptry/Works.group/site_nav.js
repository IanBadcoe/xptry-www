"use strict";

$(document).ready(function() {
    let _decors;
    let _threads;
    let _world_centre_x = 0;
    let _world_centre_y = 0;

    window.SiteNav = {
        SmartScroll : function (where) {
            if (!(where in _threads))
                return;

            let data = _threads[where];

            let dx = data.centre_x - (innerWidth - data.width) / 2 - _world_centre_x;
            let dy = data.centre_y - (innerHeight - data.height) / 2 - _world_centre_y;

            $(".scroll-container").animate({
                left: "-=" + dx + "px",
                top: "-=" + dy + "px"
            });
        },
        SmartNav : function (where) {
            where = where || this.DefaultLocation;

            this.SmartLoad(where);
            this.SmartScroll(where);

            history.pushState(where, "", this.UrlStem + "#" + where);
        },
        Init: async function(home_id) {
            this.DefaultLocation = home_id;

            let promise = this.RefreshNavData();

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
            this.SmartLoad(init_loc);
            this.SmartScroll(init_loc);

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
        },
        SmartLoad : function(target) {
            let sc = $(".scroll-container");
            let already = sc.has("#" + target);

            if (already.size() > 0)
                return;

            let data = _threads[target];

            let ne = $("<div></div>").attr({
                left : data.centre_x - data.width / 2,
                top : data.centre_y - data.height / 2,
                class : "absolute zero-spacing"
            }).css({
                "background-color" : "#" + data.colour,
                width : data.width + "px",
                height : data.height + "px"
            });

            let ctor = data.ctor;

            if (ctor in window.Ctors) {
                window.Ctors[ctor](ne)
            }

            sc.append(ne);
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});