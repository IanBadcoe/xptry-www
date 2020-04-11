"use strict";

$(document).ready(() => {
    let _data = {};
    let _existing = {};
    let _expire_ms = 5000;
    let _last_rect = new Rect(0, 0, -1, -1);
    let _force_processing = false;
    let _last_expire = 0;
    let _expire_cycle_ms = 1000;
    let _rect_fun = function() {
        return new Rect(0, 0, innerWidth, innerHeight);
    }
    let _timer = null;
    let _cycle = 100;

    function update_wrapper() {
        DemandLoader.Update(_rect_fun());
    }

    window.DemandLoader = {
        Init(cycle, expire_ms, expire_cycle_ms, rect_fun) {
            _expire_ms = expire_ms;
            _expire_cycle_ms = expire_cycle_ms;
            _rect_fun = rect_fun;
            _cycle = cycle;
            _timer = setInterval(update_wrapper, _cycle);
        },
        Register(id, rect, func, force = false) {
            // we assume, if we register a new function, that invalidates any existing element
            // but we don't generally intend to do that...
            if (_existing[id]) {
                if (force) {
                    this.Remove(id);
                } else {
                    return;
                }
            }

            _data[id] = {
                rect: rect,
                func: func
            };

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
                            remove_queue = remove_queue.filter(x => x != key);
                            add_queue.push(key);

                        //     // we'll create them hidden and show them when they hit the screen
                        //     // so we need to run once more to cover the case where they hit the screen immediately
                        //     _force_processing = true;
                        // } else if (!h_exist.shown && h_data.rect.Overlaps(rect)) {
                        //     this.ShowElement(h_exist);
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
                            add_queue = add_queue.filter(x => x != key);
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
            
            _data[id].func(ne => el = el.add(ne));

            _existing[id] = {
                el : el,
                ts : ts
            };

            // this.HideElement(_existing[id]);
        },
        RemoveElement(id) {
            if (_existing[id]) {
                _existing[id].el.remove();
                delete _existing[id];
            }
        },
        // ShowElement(exists) {
        //     exists.el.find().show();
        //     exists.el.show();
        //     exists.shown = true;
        // },
        // HideElement(exists) {
        //     exists.el.find().hide();
        //     exists.el.hide();
        //     exists.shown = false;
        // }
    };
});