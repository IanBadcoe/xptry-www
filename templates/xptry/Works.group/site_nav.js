"use strict";

$(document).ready(function() {
    let _decors;
    let _threads;
    let _paths;

    let fix_title = function(title) {
        $("title").html(title);
    }

    let fix_ctor = function(obj) {
        let ctor_string = obj.ctor;

        if (ctor_string) {
            obj.ctor = new Function("return window.Ctors." + ctor_string)();
        }

        // without any explict ctor, connections all go to the centre
        if (!obj.ctor) {
            obj.ctor = function() {
                this.connections.forEach(connect => {
                    connect.CalcStrandPoint = function() {
                        return [obj.centre_x, obj.centre_y];
                    }
                });
            }
        }
    }

    let reverse_path = function(path) {
        let copy = { ...path };

        copy.from = path.to;
        copy.to = path.from;
        copy.waypoints = path.waypoints.slice().reverse();

        copy.is_reversed = !path.is_reversed;

        return copy;
    }

    let setup_thread_connection = function(path) {
        // ignore any paths where we haven't published both end-points
        if (!(path.from in _threads) || !(path.to in _threads))
            return;

        // we're going to trash this
        path = { ...path };

        // assuming DB consistency won't allow non-existent end-points
        // so just check for not having them
        if (!path.from || !path.to)
            return;

        let f_thread = _threads[path.from];
        let t_thread = _threads[path.to];

        path.from = f_thread;
        path.to = t_thread;

        path.waypoints = path.waypoints.map(w => _decors[w]);

        path.debug_title = path.url_title + "--" + f_thread.url_title;

        f_thread.connections.push(path);
    }

    let load_nav_data = function(obj, statuses) {
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
                    let ent = _decors[k];

                    fix_ctor(ent);

                    ent.url_title = k;
                    ent.centre = new Coord(ent.centre_x, ent.centre_y);
                }
            })
        );
        promises.push(
            $.ajax(
                "{path='Ajax/threads/published}",
                {
                    dataType: "json",
                    error: ajax_error
                }
            ).then((data, status) => {
                _threads = data;

                for(const k in _threads) {
                    let ent = _threads[k];

                    fix_ctor(ent);

                    ent.connections = [];
                    ent.url_title = k;
                    ent.centre = new Coord(ent.centre_x, ent.centre_y);
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

        let ready = Promise.all(promises);

        return ready.then(() => {
            _paths.forEach(path => {
                path.is_reversed = false;
                setup_thread_connection(path);
                setup_thread_connection(reverse_path(path));
            });

            for(const k in _decors) {
                _decors[k].ctor();
            }

            for(const k in _threads) {
                _threads[k].ctor();
            }
        });
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

            this.SmartNav(where);
        },
        SmartScroll : function (where, chain_from, first, last) {
            let data = _threads[where];

            if (!data) {
                data = _decors[where];
            }

            if (!data) {
                return chain_from;
            }

            if (!chain_from) {
                chain_from = Promise.resolve(0);
            }

            return chain_from.then(() => {
                let sc = $(".scroll-container");
                let old_pos = sc.position();

                let x = -data.centre_x + innerWidth / 2;
                let y = -data.centre_y + innerHeight / 2;

                let dx = old_pos.left - x;
                let dy = old_pos.top - y;
                let dist = Math.sqrt(dx*dx + dy*dy);

                let easing = "linear";

                const ease = "Sine"

                if (first && last) {
                    easing = "easeInOut" + ease;
                } else if (first) {
                    easing = "easeIn" + ease;
                } else if (last) {
                    easing = "easeOut" + ease;
                }

                let speed = first || last ? 0.6 : 0.8;

                return sc.animate(
                    {
                        left: x + "px",
                        top: y + "px"
                    },
                    dist * speed,
                    easing
                ).promise();
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

            this.SmartLoad(where, true);
            this.SmartScroll(where, promise, first, true);

            this.PreviousLocation = where;
            history.replaceState(where, "", this.UrlStem + "#" + where);
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

            await promise;

            this.SmartNav(init_loc);

            // listen for history navigation
            addEventListener("popstate", event => {
                this.HandlePop(event.state);
            });
        },
        RefreshNavData: async function() {
            return load_nav_data(this, ["published"]);
        },
        SmartLoad : function(target, set_title, suppress_connections) {
            let data = _threads[target];
            let is_decor = false;

            if (!data) {
                is_decor = true;
                data = _decors[target];
            }

            if (!data) {
                return;
            }

            let sc = $(".scroll-container");
            let already = sc.children(".xx" + target);

            if (already.length == 0) {
                if (!is_decor) {
                    if (!data.ctor)
                    {
                        // fake connection-points for case of missing ctor
                        data.connections.forEach(x => {
                            x.CPoint = [data.centre_x, data.centre_y];
                        });
                    }

                    data.connections.forEach(connect => {
                        let target = connect.to.connections.find(x => x.to === data);

                        if (connect.waypoints.length > 0) {
                            target = connect.waypoints[0];
                        }

                        let for_back = connect.is_reversed;
                        target.SPoint = target.SPoint || {};
                        target.SPoint[for_back] = [connect.to.centre_x, connect.to.centre_y];

                        // iterate a couple of times in case both are responding to the other
                        connect.CPoint = connect.CalcStrandPoint(target.SPoint[for_back], !for_back);
                        target.SPoint[for_back] = target.CalcStrandPoint(connect.CPoint, for_back);
                        connect.CPoint = connect.CalcStrandPoint(target.SPoint[for_back], !for_back);
                        target.SPoint[for_back] = target.CalcStrandPoint(connect.CPoint, for_back);
                    });
                }

                if (data.Draw) {
                    data.Draw(sc);
                }

                if (set_title) {
                    fix_title(data.title);
                }
            }

            if (!suppress_connections && !is_decor) {
                data.connections.forEach(connect => {
                    let id = "xx" + connect.url_title;
                    let already = sc.has("#" + id);

                    if (already.length == 0) {
                        let dest = connect.to.connections.find(x => x.to === data);

                        this.SmartLoad(connect.to.url_title, false, true);

                        let prev_wp = null;
                        let for_back = connect.is_reversed;

                        for(let i = 0; i < connect.waypoints.length; i++) {
                            let wp = connect.waypoints[i];
                            wp.SPoint = wp.SPoint || {};

                            if (prev_wp) {
                                wp.SPoint[for_back] = wp.centre;

                                // iterate a couple of times in case both are responding to the other
                                prev_wp.SPoint[!for_back] = prev_wp.CalcStrandPoint(wp.SPoint[for_back], !for_back);
                                wp.SPoint[for_back] = wp.CalcStrandPoint(prev_wp.SPoint[!for_back], for_back);
                                prev_wp.SPoint[!for_back] = prev_wp.CalcStrandPoint(wp.SPoint[for_back], !for_back);
                                wp.SPoint[for_back] = wp.CalcStrandPoint(prev_wp.SPoint[!for_back], for_back);
                            }

                            prev_wp = wp;
                        }

                        let here = connect.CPoint;
                        let drawer = window.Drawers[connect.drawer];

                        connect.waypoints.forEach(wp => {
                            DrawThreadBetweenPoints(sc,
                                here[0], here[1],
                                wp.SPoint[for_back][0], wp.SPoint[for_back][1],
                                drawer,
                                id);

                            here = [wp.SPoint[!for_back][0], wp.SPoint[!for_back][1]];
                        });

                        DrawThreadBetweenPoints(sc,
                            here[0], here[1],
                            dest.CPoint[0], dest.CPoint[1],
                            window.Drawers[connect.drawer],
                            id);
                    }
                });
            }
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});