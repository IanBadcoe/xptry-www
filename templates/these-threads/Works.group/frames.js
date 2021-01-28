"use strict";

$(document).ready(() => {
    window.Frames = {
        AddFrameToBuilder(builder, frame, order, step) {
            step = step || 5;

            frame.Loops.forEach(loop => {
                builder.AddLoop({
                    Points: loop,
                    Drawer: frame.Drawer,
                    Open: false,
                    Order: order,
                    Step: step,
                    Type: "Frame"
                }, false, false, frame.Pos);
            });
        },

        Single(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            return {
                Loops: [ [ [0, 0], [size.X, 0], size, [0, size.Y] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                CornerBox: new Rect(0, 0, 0, 0),
                Pos: pos
            };
        },

        Double(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            return {
                Loops: [ [ [0, 0], [size.X, 0], size, [0, size.Y] ],
                         [ [cadence, cadence], [size.X - cadence, cadence], [size.X - cadence, size.Y - cadence], [cadence, size.Y - cadence] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                CornerBox: new Rect(0, 0, cadence, cadence),
                Pos: pos
            };
        },

        SingleExtLoop(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            let xlo = -cadence;
            let xli = 0;
            let xhi = size.X;
            let xho = size.X + cadence;
            let ylo = -cadence;
            let yli = 0;
            let yhi = size.Y;
            let yho = size.Y + cadence;

            return {
                Loops: [ [ [xlo, yli], [xho, yli], [xho, ylo],
                           [xhi, ylo], [xhi, yho], [xho, yho],
                           [xho, yhi], [xlo, yhi], [xlo, yho],
                           [xli, yho], [xli, ylo], [xlo, ylo] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                CornerBox: new Rect(-cadence, -cadence, 0, 0),
                Pos: pos
            };
        },
    };

    window.Corners = {
        AddCornersToBuilder(builder, corner, frame, order, step) {
            step = step || 5;
            builder.AddLoop({
                Points: corner.Loop,
                Drawer: corner.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Corner",
                SpliceHalfThreshold: corner.SpliceHalfThreshold
            }, false, false, frame.Pos);
            builder.AddLoop({
                Points: corner.Loop,
                Drawer: corner.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Corner",
                SpliceHalfThreshold: corner.SpliceHalfThreshold
            }, true, false, new Coord(frame.Size.X, 0).Add(frame.Pos));
            builder.AddLoop({
                Points: corner.Loop,
                Drawer: corner.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Corner",
                SpliceHalfThreshold: corner.SpliceHalfThreshold
            }, true, true, new Coord(frame.Size.X, frame.Size.Y).Add(frame.Pos));
            builder.AddLoop({
                Points: corner.Loop,
                Drawer: corner.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Corner",
                SpliceHalfThreshold: corner.SpliceHalfThreshold
            }, false, true, new Coord(0, frame.Size.Y).Add(frame.Pos));
        },
        SpliceCorners(builder) {
            let found;

            do {
                found = false;

                let loops = builder.GetLoopsOfType("Corner");

                for(let i = 0; i < loops.length - 1; i++) {
                    let loop1 = loops[i];
                    for(let j = i + 1; j < loops.length; j++) {
                        let loop2 = loops[j];

                        if (builder.Splice(loop1, loop2, "x-splice", null, true)) {
                            found = true;
                            break;
                        }

                        if (builder.Splice(loop1, loop2, "y-splice", null, true)) {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        break;
                    }
                }
            } while (found);
        },
        Square(frame, drawer) {
            const cadence = frame.Cadence;
            const box = frame.CornerBox.ExtendedBy(cadence);
            return {
                Loop: [ box.TL, "x-splice", box.TR, box.BR, box.BL, "y-splice" ],
                Drawer: drawer,
                SpliceHalfThreshold: cadence
            }
        },
    };
});