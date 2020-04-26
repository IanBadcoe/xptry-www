"use strict";

$(document).ready(() => {
    let cache = {};
    let bbg = $(".behind-background");

    window.ImageCache = {
        // returns a promise, so we can queue-up storing the reference
        Preload(path) {
            let record = {}

            let el = new Image();
            record.element = $(el);
            record.element.addClass("zero-spacing");

            // make sure it is actually loaded, so it will have a width
            bbg.append(record.element);

            // when I tried this in jQuery, if we got a 304 then the promise failed
            // which meant when I was waiting for collections of promises I lost time synchronisation
            // will still need to handle real errors on that...
            record.promise = new Promise((res, rej) => {
                el.onload = res;
                el.onerror = rej;
                el.src = path;
            }).then(() => {
                record.width = record.element.width();
                record.height = record.element.height();
                record.element.remove();
                //console.log("ImageCache Loaded: " + path);
            });

            cache[path] = record;

            return record.promise;
        },
        // allows us to wait later, or find out whether we're ready
        Promise(path) {
            return cache[path].promise;
        },
        // returns a clone of the cached elephant
        Element(path) {
            return cache[path].element.clone();
        },
        Dims(path) {
            return new Coord(cache[path].width, cache[path].height);
        },
        Clear() {
            cache = {};
        }
    };
});
