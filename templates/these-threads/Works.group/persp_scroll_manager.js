"use strict";

$(document).ready(() => {
    let _loaders = {};
    let _cycle_ms = 200;
    let _expire_ms = 300000;
    let _expire_cycle_ms = 5000;
    let _test_scale = 0.0;

    // highly abbreviated as used a lot...
    window.PSM = {
        // test_scale reduces the size of the active_rect (towards the middle of the screen)
        // allowing test pages to show what's happening "off screen"
        // setting this 1.0 would remove the rect altogether, 0.8 will take 40% off all around
        // when we have a test_scale, turn off the external margin on the demand loaders so wysiwyg
        Init(cycle_ms, expire_ms, expire_cycle_ms, container_container, test_scale) {
            _cycle_ms = cycle_ms;
            _expire_ms = expire_ms;
            _expire_cycle_ms = expire_cycle_ms;

            if (test_scale) {
                _test_scale = test_scale;
            }

            DraggablePersp.Init(container_container, $("body"));
        },
        GetElement(dist) {
            return DraggablePersp.Get(dist);
        },
        GetDemandLoader(dist) {
            let ret = _loaders[dist];
 
            if (!ret)
            {
                let el = DraggablePersp.Get(dist);

                function active_rect() {
                    let pos = el.position();
                    pos = new Coord(pos.left, pos.top).Mult(dist);
            
                    let dim = new Coord(innerWidth, innerHeight).Mult(dist);
            
                    let rect = new Rect(pos.Inverse(),
                        pos.Inverse().Add(dim));

//                    rect = DraggablePersp.TransformRect(dist, rect);

                    rect = rect.ExtendedBy(dim.Mult(-_test_scale / 2));
            
                    return rect;
                }

                let dl_margin = _test_scale ? 0.0 : 0.5;
            
                ret = CreateDemandLoader(el, _cycle_ms, _expire_ms, _expire_cycle_ms, active_rect, dl_margin);

                _loaders[dist] = ret;
            }

            return ret;
        }
    }
});