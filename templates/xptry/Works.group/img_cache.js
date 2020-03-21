"use strict";

$(document).ready(() => {
    let cache = {};

    window.ImageCache = {
        // returns a promise, so we can queue-up storing the reference
        Preload(path) {
            let record = {}

            record.element = $("<img/>").attr("src", path);
            record.promise = record.element.promise("load");

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
        }
    };
});
