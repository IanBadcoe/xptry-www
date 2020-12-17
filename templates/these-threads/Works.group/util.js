"use strict";

function vh(v) {
  let h = Math.max(document.documentElement.clientHeight, innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}

function vmin(v) {
  return Math.min(vh(v), vw(v));
}

function vmax(v) {
  return Math.max(vh(v), vw(v));
}

function add_line(el, p1, p2, style, klass, offset, nudge_vec) {
    if (nudge_vec) {
        p1 = p1.Add(nudge_vec);
        p2 = p2.Sub(nudge_vec);
    }

    if (offset) {
        p1 = p1.Add(offset);
        p2 = p2.Add(offset);
    }

    let line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
        x1: p1[0],
        y1: p1[1],
        x2: p2[0],
        y2: p2[1]
    });

    if (klass) {
        line.addClass(klass);
    }

    if (typeof style === "string") {
        line.attr({
            style: style
        });
    } else {
        line.css(style);
    }

    el.append(line);
}

// rather old version now...
function add_polyline(el, start_p, end_p, divide, interpable, style,
    closed, nudge = 0, wrap = false) {

    if (closed)
        nudge = 0;

    let coords = "";

    let range = end_p - start_p;

    for(let p = -nudge; p <= range * divide + nudge; p ++) {
        let hp = p / divide + start_p;

        if (wrap) {
            if (hp < 0) {
                hp += interpable.EndParam;
            }

            if (hp > interpable.EndParam) {
                hp -= interpable.EndParam;
            }
        }

        if (hp >= 0 && hp <= interpable.EndParam) {
            let cp = interpable.Interp(hp);

            coords += cp[0] + "," + cp[1] + " ";
        }
    }

    let line;

    if (!closed)
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline')).attr({
            points: coords,
            style: style
        });
    }
    else
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr({
            points: coords,
            style: style
        });
    }

    el.append(line);
}

function add_raw_polyline(el, coords, style, closed, klass, offset) {
    let line;

    if (offset) {
        coords = coords.map(pnt => {
            return pnt.Add(offset);
        });
    }

    if (!closed)
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline'));
    }
    else
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon'));
    }

    line.attr({
        points: coords,
    });

    if (typeof style === "string") {
        line.attr({
            style: style
        });
    } else {
        line.css(style);
    }

    if (klass) {
        line.addClass(klass);
    }

    el.append(line);
}

function add_polyline_scaled(el, start_p, end_p, p_step, interpable, style,
    closed, nudge = 0, wrap = false, klass) {

    if (closed)
        nudge = 0;

    let coords = "";

    let range = end_p - start_p;

    let num_steps = Math.floor(range / p_step);

    let act_step = range / num_steps;

    function do_coord_for_param(hp) {
        if (wrap) {
            while (hp < 0) {
                hp += interpable.EndParam;
            }

            while (hp > interpable.EndParam) {
                hp -= interpable.EndParam;
            }
        }

        if (hp >= 0 && hp <= interpable.EndParam) {
            let cp = interpable.Interp(hp);

            coords += cp[0] + "," + cp[1] + " ";
        }
    }

    if (nudge) {
        do_coord_for_param(start_p - nudge);
    }

    for(let p = 0; p <= num_steps; p++) {
        let hp = p * act_step + start_p;

        do_coord_for_param(hp);
    }

    if (nudge) {
        do_coord_for_param(end_p + nudge);
    }

    add_raw_polyline(el, coords, style, closed, klass);
}

function add_svg_link(el, href) {
    let a = document.createElementNS('http://www.w3.org/2000/svg', 'a');

    a.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);

    let ne = $(a);

    el.append(ne);

    return ne;
}

function add_svg(el, centre, coord_orig, coord_dims, klass, z) {
    let ne = $("<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'></svg>");

    ne.addClass("absolute");

    ne.attr({
        viewBox: coord_orig.X + "," + coord_orig.Y + "," + coord_dims.X + "," + coord_dims.Y
    });

    let tl = centre.Sub(coord_dims.Div(2));

    ne.css({
        left: tl.X,
        top: tl.Y,
        width: coord_dims.X,
        height: coord_dims.Y,
        "z-index": z
    });

    if (klass) {
        ne.addClass(klass);
    }

    if (el)
    {
        el.append(ne);
    }

    return ne;
}

function add_circle(el, coords, style, klass, width) {
    let circle  = $(document.createElementNS('http://www.w3.org/2000/svg', 'circle'));

    circle.attr({
        cx: coords[0],
        cy: coords[1],
        r: width
    });

    if (style) {
        if (typeof style === "string") {
            circle.attr({
                style: style
            });
        } else {
            circle.css(style);
        }
    }

    if (klass) {
        circle.addClass(klass);
    }

    el.append(circle);

    return circle;
}

function add_defs(el) {
    let already = el.children("defs");

    if (already.length === 0) {
        already = $(document.createElementNS('http://www.w3.org/2000/svg', 'defs'))

        el.prepend(already);
    }

    return already;
}

function add_pattern(el, attribs) {
    let ne = $(document.createElementNS('http://www.w3.org/2000/svg', 'pattern'));

    if (attribs) {
        ne.attr(attribs);
    }

    if (el) {
        el.append(ne);
    }

    return ne;
}

function add_image(el, attribs) {
    let ne = $(document.createElementNS('http://www.w3.org/2000/svg', 'image'));

    if (attribs) {
        ne.attr(attribs);
    }

    if (el) {
        el.append(ne);
    }

    return ne;
}

function add_arc(el, p1, p2, radius, clockwise, largepart, style, klass, offset) {
    let path_el = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

    if (offset) {
        p1 = p1.Add(offset);
        p2 = p2.Add(offset);
    }

    let path = "M " + p1.X + " " + p1.Y +
               "A " + radius + " " + radius + " 0 " + (largepart ? "1 " : "0 ") + (clockwise ? "1 " : "0 ") + p2.X + " " + p2.Y

    path_el.attr({
        d: path
    }).css(style);

    if (klass) {
        path_el.addClass(klass);
    }

    el.append(path_el);

    return path_el;
}

function rand_from_array(arr, rand) {
    return arr[Math.floor(rand.quick() * arr.length)];
}
