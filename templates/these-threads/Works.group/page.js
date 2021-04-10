"use strict";

$(document).ready(() => {
    window.Page = {
        CreateBorderedTextPage(el, title, text,
            frame_fn, frame_order, frame_drawer,
            corner_fn, corner_order, corner_drawer,
            middle_fn, middle_order, middle_drawer)
        {
            if (typeof(frame_drawer) == "string") {
                frame_drawer = Drawers[frame_drawer];
            }
            if (typeof(corner_drawer) == "string") {
                corner_drawer = Drawers[corner_drawer];
            }
            if (typeof(middle_drawer) == "string") {
                middle_drawer = Drawers[middle_drawer];
            }

            frame_order = frame_order || 2;
            corner_order = corner_order || 2;
            middle_order = middle_order || 2;

            let div = $("<div/>")
                .addClass("text-container");

            el.append(div);

            PDL.FormatIntoContainer(div, title, text, "text");

            setTimeout(() => {
                let ow = div.outerWidth();
                let oh = div.outerHeight();

                // if we placed any strophes using the [a] "anywhere" facility, we may need to enlarge the div
                // to accommodate them
                // |||
                // vvv
                let pb = parseInt(div.css("padding-bottom"));
                let pr = parseInt(div.css("padding-right"));

                let aw = 0;
                let ah = 0;

                div.children().each((i, el) => {
                    let $el = $(el);

                    let r = $el.position().left + $el.outerWidth();
                    let b = $el.position().top + $el.outerHeight();

                    let sb = b + pb - oh;
                    let sr = r + pr - ow;

                    if (sb > ah) {
                        ah = sb;
                    }

                    if (sr > aw) {
                        aw = sr;
                    }
                });

                if (ah > 0) {
                    let h = parseInt(div.css("height"));

                    div.css("height", h + ah);
                }

                if (aw > 0) {
                    let w = parseInt(div.css("width"));

                    div.css("width", w + aw);
                }

                // ^^^
                // ---
                // that done, just grab the size again in case it changed and off we go
                ow = div.outerWidth();
                oh = div.outerHeight();

                let svg = add_svg(div,
                    new Coord(ow, oh).Div(2),
                    new Coord(0, 0), new Coord(ow, oh));

                svg.addClass("text");

                let kb = new KnotBuilder;

                const frame = Frames[frame_fn](new Coord(ow - 80, oh - 80), frame_drawer, 15, new Coord(40, 40));
                Frames.AddFrameToBuilder(kb, frame, frame_order);
                const corner = Corners[corner_fn](corner_drawer, 0.7);
                Corners.AddCornersToBuilder(kb, corner, frame, corner_order);
                const middle = Middles[middle_fn](middle_drawer, 0.9);
                Middles.AddMiddlesToBuilder(kb, middle, frame, middle_order);


                let knot = kb.BuildKnot();

                knot.Draw(svg);
            }, 1);
        },
    };
});