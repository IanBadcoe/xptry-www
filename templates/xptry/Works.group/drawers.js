// used for threads and ties
MakePolylineDrawer = (width, colour, edgethick, edgecolour, hilightwidth, hilightcolour, hilightoffset, klass) => {
    let edgestyle = null;
    let hilightstyle = null;
    hilightoffset = hilightoffset || [-1, -2];

    if (edgethick) {
        edgestyle = {
            stroke: "rgb(" + edgecolour[0] + "," + edgecolour[1] + "," + edgecolour[2] + ")",
            "stroke-width": width + edgethick,
        };
    }

    if (hilightwidth) {
        hilightstyle = {
            stroke: "rgb(" + hilightcolour[0] + "," + hilightcolour[1] + "," + hilightcolour[2] + ")",
            "stroke-width": hilightwidth,
        }
    }

    let style = {
        stroke: "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")",
        "stroke-width": width,
    }

    return {
        ForeDrawPolyline: function(insert_element, points, close) {
            if (edgestyle) {
                add_raw_polyline(insert_element, points, edgestyle, close, klass);
            }
            add_raw_polyline(insert_element, points, style, close, klass);
            if (hilightstyle) {
                add_raw_polyline(insert_element, points, hilightstyle, close, klass, hilightoffset);
            }
        },
        BackDrawPolyline: function(insert_element, points, close) {
            if (edgestyle) {
                add_raw_polyline(insert_element, points, edgestyle, close, klass);
            }
            add_raw_polyline(insert_element, points, style, close, klass);
        }
    };
}
