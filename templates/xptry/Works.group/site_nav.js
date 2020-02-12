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
//            try {
                obj.ctor_fn = new Function("return window.Ctors." + ctor_string)();
//            } catch (error) {
//                alert("badly configured ctor for 'k':\n    - ctor was: " + ctor_string + "\n    - error was: " + error);
//            }
        }
    }

    window.SiteNav = {
        HandlePop : function(where) {
            // when we retype the anchor part we seem to get a popstate with no state
            let url = location.href;

            if (!where) {
                let sp = url.lastIndexOf("#");

                if (sp !== -1) {
                    where = url.substr(sp + 1);
                }
            }

            if (!where)
                return;

            this.SmartLoad(where);
            this.SmartScroll(where);
            history.replaceState(where, "", url);
        },
        SmartScroll : function (where, chain_from, first, last) {
            let data = _threads[where];

            if (!data) {
                data = _decors[where];
            }

            if (!data) {
                return chain_from;
            }

            let sc = $(".scroll-container");
            let old_pos = sc.position();

			let x = -data.centre_x + innerWidth / 2;
            let y = -data.centre_y + innerHeight / 2;

            let dx = old_pos.left - x;
            let dy = old_pos.top - y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            let easing = first ? "easeInQuint" : last ? "easeOutQuint" : "linear";

            let speed = first || last ? 0.3 : 0.4;


            if (!chain_from) {
                chain_from = Promise.resolve(0);
            }

            return chain_from.then(() => {
                sc.animate(
                    {
                        left: x + "px",
                        top: y + "px"
                    },
                    dist * speed,
                    easing
                );
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
            let first = true;

            if (steps) {
                steps.forEach(step => {
                    this.SmartLoad(step);
                    promise = this.SmartScroll(step, promise, first);
                    first = false;
                });
            }

            this.SmartLoad(where);
            this.SmartScroll(where, promise, false, true);

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
                this.HandlePop(event.state);
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

            if (already.length > 0)
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
                left: data.centre_x - data.width / 2,
                top: data.centre_y - data.height / 2,
            });

            if (data.colour) {
                // no point applying width/height unless also visible
                ne.css({
                    "background-color" : "#" + data.colour,
                    width : data.width + "px",
                    height : data.height + "px"
                });
            }

            sc.append(ne);

            let ctor = data.ctor_fn;

            if (ctor) {
                ctor(ne, data);
            }
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});