function vh(v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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
        var idx = parseFloat($(this).attr("path_p"));

        idx += offset;
        if (idx > path.EndParam)
        {
            idx = idx - path.EndParam + path.StartParam;
        }

        $(this).attr("path_p", idx);

        var p = path.Interp(idx);
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
        $(this).attr("path_p", Math.random() * (path.EndParam - path.StartParam) + path.StartParam);
    });
}

function insert_clones(sel_ins, sel_ins_after, num) {
    var ins_after = $(sel_ins_after);
    var ins = $(sel_ins);

    for(var i = 0; i < num; i++) {
        ins_after.after(ins.clone());
    }
}

// feed this an svg element for draw lines
// handy for testing splines etc...
function add_line(el, p1, p2, style) {
    var line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
        x1: p1[0],
        y1: p1[1],
        x2: p2[0],
        y2: p2[1],
        style: style
    });

    el.append(line);
}

function add_polyline(el, start_p, end_p, divide, interpable, style,
    close, nudge = 0) {

    if (close)
        nudge = 0;

    var coords = "";

    var range = end_p - start_p;

    for(var p = -nudge; p <= range * divide + nudge; p ++) {
        var hp = p / divide + start_p;

        if (hp >= interpable.StartParam && hp <= interpable.EndParam) {
            var cp = interpable.Interp(hp);

            coords += cp[0] + ", " + cp[1] + " ";
        }
    }

    var line;

    if (!close)
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
