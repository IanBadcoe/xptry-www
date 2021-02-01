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

        SpliceSubset(builder, subset_type) {
            let found;

            do {
                found = false;

                let loops = builder.GetLoopsOfType(subset_type);

                for(let i = 0; i < loops.length - 1; i++) {
                    let loop1 = loops[i];
                    for(let j = i + 1; j < loops.length; j++) {
                        let loop2 = loops[j];

                        if (builder.Splice(loop1, loop2, "x-splice", null)) {
                            found = true;
                            break;
                        }

                        if (builder.Splice(loop1, loop2, "y-splice", null)) {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        break;
                    }
                }
            } while (found);

            builder.GetLoopsOfType(subset_type).forEach(loop => {
                builder.InternalSplice(loop, "y-splice");
            })

            builder.GetLoopsOfType(subset_type).forEach(loop => {
                builder.InternalSplice(loop, "x-splice");
            })
        },

        Single(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            return {
                Loops: [ [ [0, 0], [size.X, 0], size, [0, size.Y] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                CornerBox: new Rect(0, 0, 0, 0),
                MidBox: new Rect(0, 0, 0, 0),
                Pos: pos,
                EdgeInner: 0,
                EdgeOuter: 0
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
                MidBox: new Rect(0, 0, 0, cadence),
                Pos: pos,
                EdgeInner: cadence,
                EdgeOuter: 0
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
                MidBox: new Rect(0, 0, 0, 0),
                Pos: pos,
                EdgeInner: 0,
                EdgeOuter: 0
            };
        },
        DoubleCross(size, drawer, cadence, pos) {
            pos = pos || new Coord(0, 0);

            let xlo = 0;
            let xli = cadence;
            let xml = (size.X - cadence) / 2;
            let xmh = (size.X + cadence) / 2;
            let xho = size.X;
            let xhi = size.X - cadence;

            let ylo = 0;
            let yli = cadence;
            let yml = (size.Y - cadence) / 2;
            let ymh = (size.Y + cadence) / 2;
            let yho = size.Y;
            let yhi = size.Y - cadence;

            return {
                Loops: [ [ [xlo, ylo], [xml, ylo], [xmh, yli],
                           [xhi, yli], [xhi, yml], [xho, ymh],
                           [xho, yho], [xmh, yho], [xml, yhi],
                           [xli, yhi], [xli, ymh], [xlo, yml] ],
                         [ [xli, yli], [xml, yli], [xmh, ylo],
                           [xho, ylo], [xho, yml], [xhi, ymh],
                           [xhi, yhi], [xmh, yhi], [xml, yho],
                           [xlo, yho], [xlo, ymh], [xli, yml] ] ],
                Size: size,
                Drawer: drawer,
                Cadence: cadence,
                CornerBox: new Rect(0, 0, cadence, cadence),
                MidBox: new Rect(-cadence / 2, 0, cadence / 2, cadence),
                Pos: pos,
                EdgeInner: cadence,
                EdgeOuter: 0
            };
        },
    };

    window.Corners = {
        AddCornersToBuilder(builder, corner_fn, frame, order, step) {
            let corner = corner_fn(frame);

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
        Square(drawer, tighten) {
            return frame => {
                const cadence = frame.Cadence;
                tighten = tighten || 1
                const box = frame.CornerBox.ExtendedBy(cadence * tighten);
                return {
                    Loop: [ box.TL, "x-splice", box.TR, box.BR, box.BL, "y-splice" ],
                    Drawer: drawer,
                    SpliceHalfThreshold: cadence * 0.9
                };
            };
        },
        ZigZagCrossOver(drawer, tighten) {
            return frame => {
                const cadence = frame.Cadence;
                tighten = tighten || 1
                const box = frame.CornerBox.ExtendedBy(cadence * tighten);
                const wi = frame.EdgeInner + cadence * tighten;
                // for the moment assuming that box is square...
                // can calculate more numbers if it ever is not
                const wo = -frame.EdgeOuter - cadence * tighten;
                const iae = Math.min(box.B, wi) + cadence * tighten;

                return {
                    Loop: [ [iae, wo], "x-splice", [iae + cadence, wo], [iae + cadence, wi], [iae + cadence * 2, wi], [iae + cadence * 2, wo], "x-splice", [iae + cadence * 3, wo], [iae + cadence * 3, iae],
                            [wo, iae], "y-splice", [wo, iae + cadence], [wi, iae + cadence], [wi, iae + cadence * 2], [wo, iae + cadence * 2], "y-splice", [wo, iae + cadence * 3], [iae, iae + cadence * 3], ],
                    Drawer: drawer,
                    SpliceHalfThreshold: cadence * 0.9
                };
            };
        }
    };

    window.Middles = {
        AddMiddlesToBuilder(builder, middle_fn, frame, order, step) {
            let middle = middle_fn(frame);

            step = step || 5;
            const x_mid = frame.Size.X / 2;
            const y_mid = frame.Size.Y / 2;
            builder.AddLoop({
                Points: middle.Loop,
                Drawer: middle.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Middle",
                SpliceHalfThreshold: middle.SpliceHalfThreshold
            }, false, false, new Coord(x_mid, 0).Add(frame.Pos));
            builder.AddLoop({
                Points: middle.Loop,
                Drawer: middle.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Middle",
                SpliceHalfThreshold: middle.SpliceHalfThreshold
            }, false, false, new Coord(0, y_mid).Add(frame.Pos), 1);
            builder.AddLoop({
                Points: middle.Loop,
                Drawer: middle.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Middle",
                SpliceHalfThreshold: middle.SpliceHalfThreshold
            }, false, false, new Coord(x_mid, frame.Size.Y).Add(frame.Pos), 2);
            builder.AddLoop({
                Points: middle.Loop,
                Drawer: middle.Drawer,
                Open: false,
                Order: order,
                Step: step,
                Type: "Middle",
                SpliceHalfThreshold: middle.SpliceHalfThreshold
            }, false, false, new Coord(frame.Size.X, y_mid).Add(frame.Pos), 3);
        },
        Square(drawer, tighten) {
            return frame => {
                const cadence = frame.Cadence;
                tighten = tighten || 1;
                const box = frame.MidBox.ExtendedBy(cadence * tighten);

                return {
                    Loop: [ box.TL, "x-splice", box.TR, box.BR, box.BL, "y-splice" ],
                    Drawer: drawer,
                    SpliceHalfThreshold: cadence * 0.9
                };
            };
        },
    };
});