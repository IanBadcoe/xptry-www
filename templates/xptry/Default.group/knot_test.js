$(document).ready(function(){
    var draw1 = {
        ForeDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,0,0);stroke-width:6;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:4;fill:none;stroke-linecap:butt;',
                close, 2, wrap);
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(0,0,0);stroke-width:2;fill:none;stroke-linecap:butt;',
                close, 3, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:8;fill:none;stroke-linecap:butt;',
                close, 0, wrap);
        }
    };

    var draw2 = {
        ForeDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(32,32,150);stroke-width:10;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:12;fill:none;stroke-linecap:butt;',
                close, 0, wrap);
        }
    };

    var draw3 = {
        ForeDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(0,128,0);stroke-width:8;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:2;fill:none;stroke-linecap:butt;',
                close, 2, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, divide, knot, close) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:10;fill:none;stroke-linecap:butt;',
                close, 0, wrap);
        }
    };

    var draw4 = {
        ForeDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(200,0,200);stroke-width:18;fill:none;stroke-linecap:butt;',
                close, 1, wrap);
        },
        BackDrawKnot: function(insert_element, startparam, endparam, divide, knot, close, wrap) {
            add_polyline(insert_element, startparam, endparam, divide, knot,
                'stroke:rgb(255,255,255);stroke-width:20;fill:none;stroke-linecap:butt;',
                close, 0, wrap);
        }
    };

    var knot = MakeCKnot(
        [
            {
                Drawer: draw1,
                Divide: 10,
                Points: [ [-75,-50], [-50,-50], [-25,-50], [25,-50], [50,-50], [75,-50], [75,-25], [75,25], [75,50], [50,50], [25,50], [-25,50], [-50,50], [-75,50], [-75,25], [-75,-25] ],
                Open: false,
                Order: 1
            },
            {
                Drawer: draw2,
                Divide: 10,
                Points: [ [100,25], [75,25], [50,25], [25,25], [25,50], [25,75], [25,100], [-25,100], [-25,75], [-25,50], [-25,25], [-50,25], [-75,25], [-100,25], [-100,-25], [-75,-25], [-50,-25], [-25,-25], [-25,-50], [-25,-75], [-25,-100], [25,-100], [25,-75], [25,-50], [25,-25], [50,-25], [75,-25], [100,-25], ],
                Open: true,
                Order: 2
            },
            {
                Drawer: draw3,
                Divide: 10,
                Points: [ [-50,-75], [-25,-75], [25,-75], [50,-75], [50,-50], [50,-25], [50,25], [50,50], [50,75], [25,75], [-25,75], [-50,75], [-50,50], [-50,25], [-50,-25], [-50,-50] ],
                Open: false,
                Order: 3
            }
        ]
    );

    knot.Draw($(".test-line"));
});
