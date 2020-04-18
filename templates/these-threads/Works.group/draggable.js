"use strict";

$(document).ready(() => {
    let md = false;
    let clickx = null;
    let clicky = null;
    let elx = null;
    let ely = null;

    window.Draggable = {
        Set(draggee, other_targets) {
            if (!other_targets) {
                other_targets = [];
            }

            let all = [draggee, ...other_targets];

            function mousedown(e) {
                if (!md) {
                    md = true;
                    clickx = e.pageX;
                    clicky = e.pageY;
                    let pos = draggee.position();
                    elx = pos.left;
                    ely = pos.top;
                }

                return false;
            }

            function mousemove(e) {
                if (md) {
                    draggee.css({
                        left: elx + e.pageX - clickx,
                        top: ely + e.pageY - clicky
                    });

                    $(".hack").toggle();
                    
                    return false;
                }
            }

            function mouseup(e) {
                md = false;

                return false;
            }

            all.forEach(el => {
                el.on("mousedown", mousedown);
                el.on("mouseup", mouseup);
                el.on("mousemove", mousemove);
            });
        }
    };
});