"use strict";

$(document).ready(() => {
    window.MakeRand = seed => new Math.seedrandom(seed);

    var UIRnd = MakeRand("@@UniqueIdentifier@@");

    window.UniqueIdentifier = () => {
        return "UID-" + Math.floor(UIRnd.quick() * 1000000);
    }
});