"use strict";

$(document).ready(() => {
    let md = false;
    let clickx = null;
    let clicky = null;
    let elx = null;
    let ely = null;

    window.Draggable = {
        Set(el) {
            el.on("mousedown", e => {
                md = true;
                clickx = e.pageX;
                clicky = e.pageY;
                let pos = el.position();
                elx = pos.left;
                ely = pos.top;
            });
            el.on("mouseup", e => {
                md = false;
            });
            el.on("mousemove", e => {
                if (md) {
                    el.css({
                        left: elx + e.pageX - clickx,
                        top: ely + e.pageY - clicky
                    });
                }
            })
        }
    };
});