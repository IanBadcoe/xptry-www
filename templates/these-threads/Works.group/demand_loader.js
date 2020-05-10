"use strict";

window.CreateDemandLoader = function(target_element, cycle_ms, expire_ms, expire_cycle_ms, rect_fun) {
    let _data = {};
    let _existing = {};
    let _expire_ms = 5000;
    let _last_rect = new Rect(0, 0, -1, -1);
    let _force_processing = false;
    let _last_expire = expire_ms;
    let _expire_cycle_ms = expire_cycle_ms;
    let _rect_fun = rect_fun;
    let _cycle_ms = cycle_ms;
    let _target_element = target_element;

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
            let add_queue = [];
            let remove_queue = [];

            let ts = new Date().getTime();

            let ext_rect = rect.ExtendedBy(rect.Dims().Mult(0.5));

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

            if (ts - _last_expire > _expire_cycle_ms) {
                for(const key in _existing) {
                    const h_data = _data[key];
                    const h_exist = _existing[key];

                    if (h_exist.ts + _expire_ms < ts) {
                        if (h_data.rect.Overlaps(ext_rect)) {
                            h_exist.ts = ts;
                        } else {
                            remove_queue.push(key);
                        }
                    }
                }

                _last_expire = ts;
            }

            add_queue.forEach(id => this.CreateElement(id, ts));

            remove_queue.forEach(id => this.RemoveElement(id));
        },
        Remove(id) {
            this.RemoveElement(id);

            if (_data[id]) {
                delete _data[id];
            }
        },
        CreateElement(id, ts) {
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
                ts : ts
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