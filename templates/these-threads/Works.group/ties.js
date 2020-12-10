"use strict";


window.Ties = {
    // radial ties
    // x is measured in line thicknesses
    // y is 0 on the inside of the ring and 1 on the outside
    radial1: {
        FSeqs: [
            new CoordArray([ [1.25, 0], [1.5, 1], [0, 1.75] ]),
            new CoordArray([ [0.25, 0], [0.5, 1] ]),
            new CoordArray([ [-0.75, 0], [-0.5, 1] ]),
            new CoordArray([ [0.9, 1.85], [-1.0, 1.6] ]),
            new CoordArray([ [-0.7, 1.85], [1, 1.65] ]),
        ],
        BSeqs: [
            new CoordArray([ [-0.75, 0], [-1.5, 1], [0, 1.65] ]),
        ],
        CPoint: new Coord(0, 1.75)
    },
};