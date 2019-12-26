$(document).ready(function(){
    var points = {
        A: [-50, -50],
        B: [-75, -50],
        C: [-75, -75],
        D: [-50, -75],
        E: [ 50, -50],
        F: [ 75, -50],
        G: [ 75, -75],
        H: [ 50, -75],
        I: [-50,  50],
        J: [-75,  50],
        K: [-75,  75],
        L: [-50,  75],
        M: [ 50,  50],
        N: [ 75,  50],
        O: [ 75,  75],
        P: [ 50,  75],
    };

    var knot = MakeKKnot(points, [ "A", "B", "C", "D", "A", "I", "L", "K", "J", "I", "M", "N", "O", "P", "M", "E", "H", "G", "F", "E"]);

    //-150-100     100 150
    //
    //  C   D       H   G   -150
    //
    //  B   A       E   F   -100
    //
    //
    //
    //  J   I       M   N   100
    //
    //  K   L       P   O   150

    // var lp = null;

    // for(var p = 0; p <= knot.ParamRange * 10; p ++) {
    //     var hp = p / 10 + knot.StartParam;

    //     var cp = knot.Interp(hp);

    //     if (lp) {
    //         add_line($(".test-line"), cp, lp, 'stroke:rgb(255,0,0);stroke-width:2');
    //     }

    //     lp = cp;
    // }

    add_polyline($(".test-line"), knot.StartParam, knot.EndParam, 10, knot, 'stroke:rgb(255,0,0);stroke-width:2');

//    knot.OverlayRanges.forEach(el => {
//
//    });
});
