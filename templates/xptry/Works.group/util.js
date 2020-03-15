"use strict";

function vh(v) {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
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

function apply_path(selector, path, offset)
{
    offset = offset || 0;

    $(selector).each(function() {
        let idx = parseFloat($(this).attr("path_p"));

        idx += offset;
        if (idx > path.EndParam)
        {
            idx = idx - path.EndParam;
        }

        $(this).attr("path_p", idx);

        let p = path.Interp(idx);
        $(this).css(
            {
                "transform" : "translate3d(" + p[0] + "vmin, " + p[1] + "vmin, " + p[2] + "vmin)"
            }
        );
    });
}

function apply_path_indices(selector, path)
{
    $(selector).each(function() {
        $(this).attr("path_p", Math.random() * path.EndParam);
    });
}

function insert_clones(sel_ins, sel_ins_after, num) {
    let ins_after = $(sel_ins_after);
    let ins = $(sel_ins);

    for(let i = 0; i < num; i++) {
        ins_after.after(ins.clone());
    }
}

// feed this an svg element for draw lines
// handy for testing splines etc...
function add_line(el, p1, p2, style) {
    let line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
        x1: p1[0],
        y1: p1[1],
        x2: p2[0],
        y2: p2[1],
        style: style
    });

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

    let range = end_p - start_p + nudge * 2;

    // we'll do nudge * 1/2 step on either end...
    let num_steps = Math.floor(range / p_step) + 1;

    let act_step = range / num_steps;

    for(let p = 0; p <= num_steps; p++) {
        let hp = p * act_step + start_p - nudge;

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
        left: tl.X + "px",
        top: tl.Y + "px",
        width: coord_dims.X + "px",
        height: coord_dims.Y + "px",
        "z-index": z
    });

    if (klass) {
        ne.addClass(klass);
    }

    el.append(ne);

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
}

function add_defs(el) {
    let already = el.children("defs");

    if (already.length == 0) {
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

    el.append(ne);

    return ne;
}

function add_img_fill_defs(el, img_url, id, radius) {
    let defs = add_defs(el);

    let ptn = add_pattern(defs, {
        id: id,
        width: radius * 2 + "px",
        height: radius * 2 + "px",
        x: "50%",
        y: "50%",
        patternUnits: "userSpaceOnUse"
    });

    let img = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    img.setAttributeNS("http://www.w3.org/1999/xlink", "href", img_url);

    img = $(img);

    img.attr({
        width: "100%",
        height: "100%"
    });

    ptn.append(img);

    return defs;
}

function add_holed_circle(el, outer, inner, style, klass, img_url, id) {
    add_img_fill_defs(el, img_url, id, outer);

    let path = "";
    let ipath = "";

    let char = "M ";

    let first = true;

    for(let i = 0.0; i < 120; i++) {
        let ang = i / 120.0 * Math.PI * 2;

        path = path + char + Math.sin(ang) * outer + "," + Math.cos(ang) * outer + " ";

        ipath = ipath + char + Math.sin(ang) * inner + "," + Math.cos(ang) * inner + " ";

        if (first) {
            char = "L ";
            first = false;
        } else {
            char = "";
        }
    }

    path = path + "z ";
    ipath =ipath + "z ";

    let path_el = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

    path_el.attr({
        d: path + ipath,
        fill: "url(#" + id + ")",
        style: style,
        "fill-rule": "evenodd"
    });

    if (klass) {
        path_el.addClass(klass);
    }

    el.append(path_el);

    return path_el;
}

function add_arc(el, p1, p2, radius, clockwise, largepart, style, klass) {
    let path_el = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

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
