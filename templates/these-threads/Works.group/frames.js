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

        Simple(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            return {
                Loops: [ [ [0, 0], [size.X, 0], size, [0, size.Y] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                Thick: new Coord(0, 0),
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
                Thick: new Coord(cadence, cadence),
                Pos: pos
            }
        }
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
            const thick = frame.Thick;
            return {
                Loop: [ [ -cadence, -cadence], "x-splice", [thick.X + cadence, -cadence], [thick.X + cadence, thick.Y + cadence], [-cadence, thick.Y + cadence], "y-splice" ],
                Drawer: drawer,
                SpliceHalfThreshold: cadence
            }
        },
    };
});