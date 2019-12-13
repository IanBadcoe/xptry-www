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

function apply_path(selector, fn)
{
    $(selector).each(function() {
        var idx = $(this).attr("path_p");
        var p = fn(idx);
        $(this).css(
            {
                "transform" : "translate3d(" + p.x + "vmin, " + p.y + "vmin, " + p.z + "vmin)"
            }
        );
    });
}

function apply_path_indices(selector, start, inc)
{
    var idx = start;
    $(selector).each(function() {
        $(this).attr("path_p", idx);
        idx += inc;
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

