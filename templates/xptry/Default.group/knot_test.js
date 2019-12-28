$(document).ready(function(){
    var points = {
        A0: [ -25, -100],
        B0: [  25, -100],
        C0: [ -50,  -75],
        C0: [ -50,  -75],
        C0: [ -50,  -75],
        C0: [ -50,  -75],
        D0: [ -25,  -75],
        D0: [ -25,  -75],
        D0: [ -25,  -75],
        D0: [ -25,  -75],
        E0: [  25,  -75],
        E0: [  25,  -75],
        E0: [  25,  -75],
        E0: [  25,  -75],
        F0: [  50,  -75],
        F0: [  50,  -75],
        F0: [  50,  -75],
        F0: [  50,  -75],
        G0: [ -75,  -50],
        G0: [ -75,  -50],
        G0: [ -75,  -50],
        G0: [ -75,  -50],
        H0: [ -50,  -50],
        I0: [ -25,  -50],
        J0: [  25,  -50],
        K0: [  50,  -50],
        L0: [  75,  -50],
        M0: [-100,  -25],
        N0: [ -75,  -25],
        O0: [ -50,  -25],
        P0: [ -25,  -25],
        Q0: [  25,  -25],
        R0: [  50,  -25],
        S0: [  75,  -25],
        T0: [ 100,  -25],
        U0: [-100,   25],
        V0: [ -75,   25],
        W0: [ -50,   25],
        X0: [ -25,   25],
        Y0: [  25,   25],
        Z0: [  50,   25],
        A1: [  75,   25],
        B1: [ 100,   25],
        C1: [ -75,   50],
        D1: [ -50,   50],
        E1: [ -25,   50],
        F1: [  25,   50],
        G1: [  50,   50],
        H1: [  75,   50],
        I1: [ -50,   75],
        J1: [ -25,   75],
        K1: [  25,   75],
        L1: [  50,   75],
        M1: [ -25,  100],
        N1: [  25,  100]
    };

    var foredraw = {
        DrawKnot: function(insert_element, startparam, endparam, divide, knot) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,0,0);stroke-width:6;fill:none');
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:4;fill:none');
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(0,0,0);stroke-width:2;fill:none');
        }
    };

    var backdraw = {
        DrawKnot: function(insert_element, startparam, endparam, divide, knot) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:8;fill:none');
        }
    };

    var knot = MakeKKnot(
        points,
        [
            [ "G0", "H0", "I0", "J0", "K0", "L0", "S0", "A1",
              "H1", "G1", "F1", "E1", "D1", "C1", "V0", "N0"],
            [ "A0", "B0", "E0", "J0", "Q0", "R0", "S0",
              "T0", "B1", "A1", "Z0", "Y0", "F1", "K1",
              "N1", "M1", "J1", "E1", "X0", "W0", "V0",
              "U0", "M0", "N0", "O0", "P0", "I0", "D0"],
            [ "C0", "D0", "E0", "F0", "K0", "R0", "Z0", "G1",
              "L1", "K1", "J1", "I1", "D1", "W0", "O0", "H0"],
        ],
        foredraw, backdraw, 10
    );

    knot.Draw($(".test-line"));
});
