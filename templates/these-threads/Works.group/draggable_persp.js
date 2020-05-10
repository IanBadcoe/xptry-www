"use strict";

$(document).ready(() => {
    let _md = false;
    let _click_pos = null;
    let _main_target = null;
    let _all_targets = [];
    let _old_pos = null;
    let _container = null;
    let _mouse_target = null;

    function mousedown(e) {
        if (!_md) {
            _md = true;
            _click_pos = new Coord(e.pageX, e.pageY);
            let pos = _main_target.position();
            _old_pos = new Coord(pos.left, pos.top);
        }

        return false;
    }

    function mousemove(e) {
        if (_md) {
            let move = new Coord(e.pageX, e.pageY).Sub(_click_pos);
            let main_pos = _old_pos.Add(move);

            _all_targets.forEach(x => {
                x.element.css({
                    left: main_pos.X / x.dist,
                    top: main_pos.Y
                });
            });

            $(".hack").toggle();
            
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
                    found = x.element;
                }
                if(x.dist > dist) {
                    ins_before++;
                }
            });

            if (found)
                return found;

            let klass = ("scroll-container-" + dist).replace(".", "-");

            let el = $("<div></div>")
                .addClass("scroll-container zero-spacing")
                .addClass(klass)
                .css({
                    transform: "scale(" + 1 / dist + ")"
                });

            let ent = {
                element: el,
                dist: dist,
                klass: klass
            };

            if (!_all_targets.length) {
                _container.append(el);
            } else {
                _container.children().eq(ins_before).before(el);
            }

            _all_targets.splice(ins_before, 0, ent);

            return ent.element;
        }
    };
});