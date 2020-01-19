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

function add_polyline_scaled(el, start_p, end_p, p_step, interpable, style,
    closed, nudge = 0, wrap = false) {

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

function add_raw_polyline(el, coords, style, closed) {
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

function add_raw_polyline_offset(el, coords, style, closed, offset) {
    let line;

    let here_points = coords.map(pnt => {
        return [pnt[0] + offset[0], pnt[1] + offset[1]];
    });

    if (!closed)
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline')).attr({
            points: here_points,
            style: style
        });
    }
    else
    {
        line = $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr({
            points: here_points,
            style: style
        });
    }

    el.append(line);
}
