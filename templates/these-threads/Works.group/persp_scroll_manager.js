"use strict";

$(document).ready(() => {
    let _loaders = {};
    let _cycle_ms = 200;
    let _expire_ms = 300000;
    let _expire_cycle_ms = 5000;

    // highly abbreviated as used a lot...
    window.PSM = {
        Init(cycle_ms, expire_ms, expire_cycle_ms, container_container) {
            _cycle_ms = cycle_ms;
            _expire_ms = expire_ms;
            _expire_cycle_ms = expire_cycle_ms;

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
                    pos = new Coord(pos.left, pos.top);
            
                    let dim = new Coord(innerWidth, innerHeight);
            
                    let rect = new Rect(pos.Inverse(),
                        pos.Inverse().Add(dim));
            
                    return rect;
                }
            
                ret = CreateDemandLoader(el, _cycle_ms, _expire_ms, _expire_cycle_ms, active_rect);

                _loaders[dist] = ret;
            }

            return ret;
        }
    }
});