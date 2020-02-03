"use strict";

$(document).ready(function() {
    let _decors;
    let _threads;
    let _paths;

    let fix_ctor = function(obj) {
        obj.ctor_fn = null;

        let ctor_string = obj.ctor;

        if (ctor_string)
        {
            try {
                obj.ctor_fn = new Function("return window.Ctors." + ctor_string)();
            } catch (error) {
                alert("badly configured ctor for 'k':\n    - ctor was: " + ctor_string + "\n    - error was: " + error);
            }
        }
    }

    window.SiteNav = {
        SmartScroll : function (where, chain_from) {
            let data = _threads[where];

            if (!data) {
                data = _decors[where];
            }

            if (!data) {
                return chain_from;
            }

			let dx = -data.centre_x + innerWidth / 2;
            let dy = -data.centre_y + innerHeight / 2;

            if (!chain_from) {
                chain_from = Promise.resolve(0);
            }

            return chain_from.then(() => {
                $(".scroll-container").animate({
                    left: dx + "px",
                    top: dy + "px"
                });
            });
        },
        SmartNav : function (where) {
            where = where || this.DefaultLocation;

            let steps = null;

            if (this.PreviousLocation) {
                let path = _paths.find(x => x.from === this.PreviousLocation && x.to === where );

                if (path) {
                    steps = path.waypoints;
                } else {
                    // look for reverse of route
                    path = _paths.find(x => x.to === this.PreviousLocation && x.from === where );

                    if (path) {
                        steps = path.waypoints.slice().reverse();
                    }
                }
            }

            let promise = null;

            if (steps) {
                steps.forEach(step => {
                    this.SmartLoad(step);
                    promise = this.SmartScroll(step, promise);
                });
            }

            this.SmartLoad(where);
            this.SmartScroll(where, promise);

            this.PreviousLocation = where;
            history.pushState(where, "", this.UrlStem + "#" + where);
        },
        Init: async function(home_id) {
            this.DefaultLocation = home_id;
            this.PreviousLocation = false;

            let promise = this.RefreshNavData();

            let url = location.href;
            let sp = url.lastIndexOf("#");

            // if we don't have a location, set the home_id
            if (sp === -1) {
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
            this.PreviousLocation = init_loc;

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
                        dataType: "json",
                        error: ajax_error
                    }
                ).then((data, status) => {
                    _decors = data;

                    for(const k in _decors) {
                        fix_ctor(_decors[k]);
                    }
                })
            );
            promises.push(
                $.ajax(
                    "{path='Ajax/threads}",
                    {
                        dataType: "json",
                        error: ajax_error
                    }
                ).then((data, status) => {
                    _threads = data;

                    for(const k in _threads) {
                        fix_ctor(_threads[k]);
                    }
                })
            );
            promises.push(
                $.ajax(
                    "{path='Ajax/paths}",
                    {
                        dataType: "json",
                        error: ajax_error
                    }
                ).then((data, status) => {
                    _paths = data;
                })
            );

            return Promise.all(promises);
        },
        SmartLoad : function(target) {
            let sc = $(".scroll-container");
            let already = sc.has("#" + target);

            if (already.size() > 0)
                return;

            let data = _threads[target];

            if (!data) {
                data = _decors[target];
            }

            if (!data) {
                return;
            }

            let ne = $("<div></div>").attr({
                class: "absolute zero-spacing",
                id: target
            }).css({
                "background-color" : "#" + data.colour,
                left: data.centre_x - data.width / 2,
                top: data.centre_y - data.height / 2,
                width : data.width + "px",
                height : data.height + "px"
            });

            let ctor = data.ctor_fn;

            if (ctor) {
                ctor(ne, data);
            }

            sc.append(ne);
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});