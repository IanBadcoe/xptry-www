"use strict";

$(document).ready(() => {
    let _md = false;
    let _click_pos = null;
    let _main_target = null;
    let _all_targets = [];
    let _start_pos = null;
    let _container = null;
    let _mouse_target = null;
    let _old_pos = new Coord(0, 0);

    function refresh_secondary_targets(force) {
        if (!_main_target)
            return;

        let pos = new Coord(
            parseFloat(_main_target.css("left")),
            parseFloat(_main_target.css("top"))
        );

        if (!force && pos.Equal(_old_pos))
            return;

        _all_targets.forEach(x => {
            if (x.dist !== 1.0) {
                x.el.css({
                    left: pos.X / x.dist,
                    top: pos.Y
                });
            }
        });

        _old_pos = pos;

        // debug_print();
    }

    // function debug_print() {
    //     _all_targets.forEach(x => {
    //         x.d_el.children(".coords").text("x: " + x.el.css("left") + ", y: " + x.el.css("top"));
    //     });
    // }

    function mousedown(e) {
        if (!_md) {
            _md = true;
            _click_pos = new Coord(e.pageX, e.pageY);
            _start_pos = new Coord(
                parseFloat(_main_target.css("left")),
                parseFloat(_main_target.css("top"))
            );
        }

        return false;
    }

    function set_pos(main_pos) {
        _main_target.css({
            left: main_pos.X,
            top: main_pos.Y
        });

        refresh_secondary_targets();

        $(".hack").toggle();
    }

    function mousemove(e) {
        if (_md) {
            let move = new Coord(e.pageX, e.pageY).Sub(_click_pos);

            if (!move.Equal(Coord.Zero))
            {
                let main_pos = _start_pos.Add(move.Mult(PSM.Scale));

                set_pos(main_pos);
            }

            return false;
        }
    }

    function mouseup(e) {
        _md = false;

        return false;
    }

    window.DraggablePersp = {
        // assumptions:
        // 1) we initialise with the main perspective plane, which is at relative distance: 1.0
        // 1a) and mouse_target, which  is the only element that needs to handle mouse events
        // 2) the initial position of all planes is acceptable at (0, 0)
        //    ( if that wasn't the case, then we'd need to record the start pos of all targets
        //      and add/subtract those when going between the main and other targets )
        Init(container, mouse_target) {
            _container = container;
            _mouse_target = mouse_target;

            _mouse_target.on("mousedown", mousedown);
            _mouse_target.on("mouseup", mouseup);
            _mouse_target.on("mousemove", mousemove);

            _main_target = this.Get(1.0);
        },
        Get(dist) {
            let ins_before = 0;
            let found = null;

            _all_targets.forEach(x => {
                if (x.dist === dist) {
                    found = x.el;
                }
                if(x.dist > dist) {
                    ins_before++;
                }
            });

            if (found)
                return found;

            let klass = ("scroll-container-" + dist).replace(".", "-");
//            let d_klass = ("debug-" + dist).replace(".", "-");

            let el = $("<div></div>")
                .addClass("scroll-container zero-spacing")
                .addClass(klass)
                .css({
                    transform: "scale(" + 1 / dist + ")"
                });

//            let d_el = $("." + d_klass);

            let ent = {
                el: el,
                dist: dist,
                klass: klass,
//                d_el: d_el
            };

            if (!_all_targets.length) {
                _container.append(el);
            } else {
                _container.children().eq(ins_before).before(el);
            }

            _all_targets.splice(ins_before, 0, ent);

            refresh_secondary_targets(true);

            return ent.el;
        },
        Refresh() {
            refresh_secondary_targets();
        },
        // takes a rect on the _main_target plane and converts it to one on the given dist plane
        TransformRect(dist, rect) {
            return new Rect(rect.TL.Mult(dist), rect.BR.Mult(dist));
        },
        SetPos(pos) {
            set_pos(pos);
        },
        GetPos() {
            let pos = new Coord(
                parseFloat(_main_target.css("left")),
                parseFloat(_main_target.css("top"))
            );
            return pos;
        }
    };
});