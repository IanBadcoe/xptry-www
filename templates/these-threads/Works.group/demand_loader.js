"use strict";

// external_margin_fraction is how much we extend the rect by so as to load things a little before they are needed
// (allowing for things that take moment to load)
window.CreateDemandLoader = function(target_element, cycle_ms, rect_fun, external_margin_fraction, draw_debug_rect) {
    let _data = {};
    let _existing = {};
    let _last_rect = new Rect(0, 0, -1, -1);
    let _force_processing = false;
    let _rect_fun = rect_fun;
    let _cycle_ms = cycle_ms;
    let _target_element = target_element;
    let _external_margin_fraction = 0.5;
    let _draw_debug_rect = false;

    if (external_margin_fraction !== null && external_margin_fraction !== undefined) {
        _external_margin_fraction = external_margin_fraction;
    }

    if (draw_debug_rect !== null && draw_debug_rect !== undefined) {
        _draw_debug_rect = draw_debug_rect;
    }

    function debug_rect_draw(_target_element, ext_rect) {
        let debug_element = _target_element.find(".demand_debug_rect");
    
        if (!debug_element.length) {
            debug_element = $("<div></dinv>").css({
                "background-color": "rgba(128,64,64,0.5)",
                position: "absolute"
            }).addClass("demand_debug_rect");
    
            _target_element.append(debug_element);
        }
    
        debug_element.css({
            left: ext_rect.L,
            top: ext_rect.T,
            width: ext_rect.Dims().X,
            height: ext_rect.Dims().Y
        });
    
        debug_element = _target_element.find(".demand_debug_rect2");
    
        if (!debug_element.length) {
            debug_element = $("<div></dinv>").css({
                "background-color": "rgba(128,128,128,0.5)",
                position: "absolute",
                left: 0,
                top: 0,
                width: 1920,
                height: 969
            }).addClass("demand_debug_rect2");
    
            _target_element.append(debug_element);
        }
    }
    
    let ret = {
        Stop() {
            clearTimeout(_timer);
        },
        // obj.load actually creates the elements
        // destroy_func is called before we destroy the elements, allow us to do any other clean-up
        Register(obj, force = false) {
            let id = obj.url_title;

            if (_data[id]) {
                if (force) {
                    this.Remove(id);
                } else {
                    return;
                }
            }

            _data[id] = obj;

            _force_processing = true;
        },
        Update(rect) {
            rect = rect.Mult(PSM.Scale);

            let add_queue = [];
            let fade_in_queue = [];
            let fade_out_queue = [];
            let remove_queue = [];

            let ext_rect = rect.ExtendedBy(rect.Dims().Mult(_external_margin_fraction));

            if (_draw_debug_rect) {
                debug_rect_draw(_target_element, ext_rect);
            }

            if (_force_processing || !_last_rect.Equal(rect)) {
                _force_processing = false;

                for(const key in _data) {
                    const h_data = _data[key];
                    const h_exist = _existing[key];

                    if (h_data.rect.Overlaps(ext_rect)) {
                        if (!h_exist) {
                            add_queue.push(key);
                        }
                    }
                }

                _last_rect = rect;
            }

            for(const key in _existing) {
                const h_data = _data[key];
                const h_exist = _existing[key];

                if (!h_data.rect.Overlaps(ext_rect)) {
                    remove_queue.push(key);
                }
            }

            add_queue.forEach(id => this.CreateElement(id));

            remove_queue.forEach(id => this.RemoveElement(id));
        },
        Remove(id) {
            this.RemoveElement(id);

            if (_data[id]) {
                delete _data[id];
            }
        },
        CreateElement(id) {
            let el = $();
            let idx = 0;
            
            _data[id].load(ne => {
                ne.attr("id", id + ":" + idx);
                idx++;
                el = el.add(ne);
                _target_element.append(ne);
            });

            _existing[id] = {
                el : el,
                opacity: 0
            };
        },
        RemoveElement(id) {
            if (_existing[id]) {
                _existing[id].el.remove();
                delete _existing[id];
            }
        },
    };

    function update_wrapper() {
        ret.Update(_rect_fun());
    }

    let _timer = setInterval(update_wrapper, _cycle_ms);

    return ret;
};
