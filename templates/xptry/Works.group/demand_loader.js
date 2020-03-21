"use strict";

$(document).ready(() => {
    let data = {};
    let existing = {};
    let expire_ms = 5000;
    let last_rect = new Rect(0, 0, -1, -1);
    let new_added = false;

    window.DemandLoader = {
        Register : function(id, rect, func) {
            // we assume, if we register a new function, that invalidates any existing element
            if (existing[id]) {
                this.Remove(id);
            }

            data[id] = {
                rect: rect,
                func: func
            };

            new_added = true;
        },
        Update : function(rect) {
            let add_queue = [];
            let remove_queue = [];

            let ts = new Date().getTime();

            if (new_added || !last_rect.Equal(rect)) {

                for(const key in data) {
                    const h_data = data[key];
                    const h_exist = existing[key];

                    if (!h_exist && h_data.rect.Overlaps(rect)) {
                        remove_queue = remove_queue.filter(x => x != key);
                        add_queue.push(key);
                    }
                }

                new_added = false;
                last_rect = rect;
            }

            for(const key in existing) {
                const h_data = data[key];
                const h_exist = existing[key];

                if (h_exist.ts + expire_ms < ts) {
                    if (h_data.rect.Overlaps(rect)) {
                        h_exist.ts = ts;
                    } else {
                        add_queue = add_queue.filter(x => x != key);
                        remove_queue.push(key);
                    }
                }
            }

            add_queue.forEach(id => this.CreateElement(id, ts));

            remove_queue.forEach(id => this.RemoveElement(id));
        },
        Remove : function(id) {
            this.RemoveElement(id);

            if (data[id]) {
                delete data[id];
            }
        },
        CreateElement(id, ts) {
            existing[id] = {
                el : data[id].func(),
                ts : ts
            };
        },
        RemoveElement(id) {
            if (existing[id]) {
                existing[id].el.remove();
                delete existing[id];
            }
        }
    };
});