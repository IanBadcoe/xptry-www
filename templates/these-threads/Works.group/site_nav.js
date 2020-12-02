"use strict";

$(document).ready(function() {
    let _decors;
    let _threads;
    let _paths;

    function get_pos_to_centre_node(node) {
        let inner_half_size = new Coord(innerWidth / 2, innerHeight / 2).Mult(PSM.Scale);

        return inner_half_size.Sub(node.centre);
    }

    function fix_title(title) {
        $("title").html(title);
    }

    function fix_ctor(obj) {
        let ctor_string = obj.ctor;

        if (ctor_string) {
            obj.ctor = new Function("return Ctors." + ctor_string)();
        }

        // without any explict ctor, connections all go to the centre
        if (!obj.ctor) {
            obj.ctor = function() {
                if (this.connections)
                {
                    this.connections.forEach(connect => {
                        connect.CalcStrandPoint = function() {
                            return obj.centre;
                        }
                    });
                }
            }
        }
    }

    function setup_thread_connection(path) {
        // ignore any paths where we haven't published both end-points
        if (!(path.from in _threads) || !(path.to in _threads))
            return;

        // assuming DB consistency won't allow non-existent end-points
        // so just check for not having them
        if (!path.from || !path.to)
            return;

        path.from = _threads[path.from];
        path.to = _threads[path.to];

        path.waypoints = path.waypoints.map(w => _decors[w]);

        path.from.connections.push({
            path: path,
            debug_title: path.url_title + "--" + path.from.url_title,
            forwards: true
        });

        path.to.connections.push({
            path: path,
            debug_title: path.url_title + "--" + path.to.url_title,
            forwards: false
        });
    }

    function calc_node_cpoint(connect, node) {
        if (!connect.calculated) {
            let target = null;
            let wps = connect.path.waypoints;

            if (wps.length > 0) {
                if (connect.forwards) {
                    target = wps[0];
                } else {
                    target = wps[wps.length - 1];
                }
            }
            else
            {
                if (connect.forwards) {
                    target = connect.path.to.connections.find(x => x.path.from === node);
                } else {
                    target = connect.path.from.connections.find(x => x.path.to === node);
                }
            }

            target.SPoint = target.SPoint || {};
            connect.SPoint = connect.SPoint || {};

            let f = connect.forwards;

            target.SPoint[!f] = node.centre;

            // iterate a couple of times in case both are responding to the other
            connect.SPoint[f] = connect.CalcStrandPoint(target.SPoint[!f], f, connect.path.drawer, false);
            target.SPoint[!f] = target.CalcStrandPoint(connect.SPoint[f], !f, connect.path.drawer, false);
            connect.SPoint[f] = connect.CalcStrandPoint(target.SPoint[!f], f, connect.path.drawer, true);
            target.SPoint[!f] = target.CalcStrandPoint(connect.SPoint[f], !f, connect.path.drawer, true);

            connect.calculated = true;
        }
    }

    function add_drawers_to_path_waypoints(path) {
        path.waypoints.forEach(wp => {
            wp.drawer = path.drawer;
        });
    }

    function build_path(path) {
        let from = path.from;
        let to = path.to;

        let to_connect = to.connections.find(x => x.path.from === from);
        let from_connect = from.connections.find(x => x.path.to === to);
        // calculate connection point for ends, if required
        calc_node_cpoint(to_connect, to);
        calc_node_cpoint(from_connect, from);

        let prev_wp = null;

        path.waypoints.forEach(wp => {
            wp.SPoint = wp.SPoint || {};

            if (prev_wp) {
                wp.SPoint[false] = wp.centre;

                // iterate a couple of times in case both are responding to the other
                prev_wp.SPoint[true] = prev_wp.CalcStrandPoint(wp.SPoint[false], true, path.drawer, false);
                wp.SPoint[false] = wp.CalcStrandPoint(prev_wp.SPoint[true], false, path.drawer, false);
                prev_wp.SPoint[true] = prev_wp.CalcStrandPoint(wp.SPoint[false], true, path.drawer, true);
                wp.SPoint[false] = wp.CalcStrandPoint(prev_wp.SPoint[true], false, path.drawer, true);
            }

            prev_wp = wp;
        });

        let prev = from_connect.SPoint[true];
        let prev_name = from.url_title;

        let xtend = [...path.waypoints, to_connect];

        xtend.forEach(wp => {
            let wp_name = wp.url_title || wp.debug_title;
            let p1 = prev;
            let p2 = wp.SPoint[false];

            let strand_seg = {
                url_title: prev_name + "|" + wp_name,
                load: ret_fn=> ret_fn(DrawStrandBetweenPoints(null, p1, p2, path.drawer)),
                from: prev,
                to: wp,
                rect: new Rect(prev, wp.SPoint[false])
            };

            PSM.GetDemandLoader(1.0).Register(strand_seg);

            prev = wp.SPoint[true];
            prev_name = wp_name;
        });
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
                    delete ent.centre_x;
                    delete ent.centre_y;
                    ent.dims = new Coord(ent.width, ent.height);
                    delete ent.width;
                    delete ent.height;

                    if (ent.images && ent.images.length) {
                        ent.images.forEach(image_path => ImageCache.Preload(image_path));
                    }
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
                    delete ent.centre_x;
                    delete ent.centre_y;
                    ent.dims = new Coord(ent.width, ent.height);
                    delete ent.width;
                    delete ent.height;

                    if (ent.images && ent.images.length) {
                        ent.images.forEach(image_row => ImageCache.Preload(image_row.file));
                    }
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

                for(const k in _paths) {
                    let ent = _paths[k];

                    ent.drawer = Drawers[ent.drawer];
                }
            })
        );

        let ready = Promise.all(promises);

        return ready.then(() => {
            // this all waits until now, so we can do it in the right order
            // e.g. setup the connections on the threads before running their ctors

            _paths.forEach(path => {
                path.is_reversed = false;
                setup_thread_connection(path);
                add_drawers_to_path_waypoints(path);
            });

            for(const k in _threads) {
                _threads[k].ctor();
            }

            for(const k in _decors) {
                _decors[k].ctor();
            }

            _paths.forEach(path => {
                build_path(path);
            });
        });
    }

    window.SiteNav = {
        HandlePop(where) {
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
        SmartScroll(node, chain_from, first, last) {
            if (!node) {
                return chain_from;
            }

            if (!chain_from) {
                chain_from = Promise.resolve(0);
            }

            return chain_from.then(() => {
                let sc = PSM.GetElement(1.0);
                let old_pos  = new Coord(
                    parseFloat(sc.css("left")),
                    parseFloat(sc.css("top"))
                );

                let p = get_pos_to_centre_node(node);

                let dp = old_pos.Sub(p);
                let dist = dp.Length();

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
                        left: p.X,
                        top: p.Y
                    }, {
                        duration: dist * speed,
                        easing: easing,
                        step: DraggablePersp.Refresh
                    }
                ).promise();
            });
        },
        Teleport(node) {
            let sc = PSM.GetElement(1.0);

            let p = get_pos_to_centre_node(node);

            sc.css({
                left: p.X,
                top: p.Y
            });
        },
        SmartNav(where, teleport) {
            where = where || this.DefaultLocation;

            let dest_node = _threads[where] || _decors[where];

            if (!dest_node)
                return;

            let steps = null;

            if (this.CurrentNode) {
                let path = _paths.find(x => x.from === this.CurrentNode && x.to === dest_node );

                if (path) {
                    steps = path.waypoints;
                } else {
                    // look for reverse of route
                    path = _paths.find(x => x.to === this.CurrentNode && x.from === dest_node );

                    if (path) {
                        steps = path.waypoints.slice().reverse();
                    }
                }
            }

            if (!teleport) {
                let promise = null;
                let first = true;

                if (steps) {
                    steps.forEach(step => {
                        promise = this.SmartScroll(step, promise, first);
                        first = false;
                    });
                }

                fix_title(dest_node.title);
                this.SmartScroll(dest_node, promise, first, true);
            } else {
                this.Teleport(dest_node);
            }

            this.CurrentNode = dest_node;
            history.replaceState(where, "", this.UrlStem + "#" + where);
        },
        Init: async function(home_id) {
            this.DefaultLocation = home_id;
            this.CurrentNode = null;

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

            this.SmartNav(init_loc, true);

            // listen for history navigation
            addEventListener("popstate", event => {
                this.HandlePop(event.state);
            });
        },
        RefreshNavData: async function() {
            return load_nav_data(this, ["published"]);
        }
    };
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }
});
