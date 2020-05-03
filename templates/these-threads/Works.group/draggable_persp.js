"use strict";

$(document).ready(() => {
    let md = false;
    let click_pos = null;
    let main_target = null;
    let other_targets = null;
    let old_pos = null;

    window.DraggablePersp = {
        // targets is an array:
        // [
        //     {
        //          element: $(...),
        //          dist: 1.0     
        //     },
        //     ...
        // ]

        // we are assuming here, that the initial position of all the elements is (0, 0)
        // if that isn't the case, then we need to record the start pos of all targets
        // and add/subtract those when going between the main and other targets
        Set(targets) {
            main_target = targets[0];
            other_targets = targets.slice(1);

            function mousedown(e) {
                if (!md) {
                    md = true;
                    click_pos = new Coord(e.pageX, e.pageY);
                    let pos = main_target.element.position();
                    old_pos = new Coord(pos.left, pos.top);
                }

                return false;
            }

            function mousemove(e) {
                if (md) {
                    let move = new Coord(e.pageX, e.pageY).Sub(click_pos);
                    let main_pos = old_pos.Add(move);

                    [main_target, ...other_targets].forEach(x => {
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
                md = false;

                return false;
            }

            main_target.element.on("mousedown", mousedown);
            main_target.element.on("mouseup", mouseup);
            main_target.element.on("mousemove", mousemove);
        }
    };
});