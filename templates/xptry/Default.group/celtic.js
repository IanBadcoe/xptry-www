(
    function() {
        MakeKKnot = function(points, sequences) {
            if (!Array.isArray(sequences[0]))
            {
                sequences = [sequences];
            }

            var _intersects = [];

            Object.keys(points).forEach(el => {
                _intersects[el] = {
                    pnt: points[el],
                    name: el,
                    count: 0,
                    is_over: null       // three valued logic, null = unset...
                };
            });

            sequences.forEach(seq => {
                seq.forEach(el => {
                    _intersects[el].count++;

                    if (_intersects[el].count > 2) {
                        throw "triple and greater intersections are not supported"
                    }
                });
            });

            var sequence = sequences[0];
            sequences.splice(0, 1);
            var next_over = false;
            var ret = [];

            while(sequence)
            {
                var _anno_points = [];
                var _points = [];

                sequence.forEach(el => {
                    var inter = _intersects[el];

                    if (inter.count < 2)
                    {
                        _anno_points.push({
                            over: null,
                            pnt: inter.pnt,
                            name: el
                        });
                    } else {
                        _anno_points.push({
                            over: next_over,
                            pnt: inter.pnt,
                            name: el
                        });

                        inter.is_over = next_over;

                        next_over = !next_over;
                    }

                    _points.push(inter.pnt);
                });

                var _spline = MakeUniformBSpline(_points, 3, true);

                var _overlay_ranges = [];

                _anno_points.forEach((el, idx) => {
                    if (el.over) {
                        // we index from zero, the spline starts from StartParam
                        // and there's another +1 here because points actually appear at the _end_ of there range...
                        _overlay_ranges.push([idx + _spline.StartParam + 0.5, idx + _spline.StartParam + 1.5]);
                    }
                });

                ret.push({
                    Spline: _spline,
                    OverlayRanges: _overlay_ranges,
                    get StartParam() {
                        return this.Spline.StartParam;
                    },
                    get EndParam() {
                        return this.Spline.EndParam;
                    },
                    get ParamRange() {
                        return this.Spline.ParamRange;
                    },
                    Interp: function(x) {
                        var hx = x;

                        while(hx > this.EndParam)
                        {
                            hx -= this.ParamRange;
                        }
                        while(hx < this.StartParam)
                        {
                            hx += this.ParamRange;
                        }

                        return this.Spline.Interp(hx);
                    }
                });

                sequence = null;

                if (sequences.length == 0)
                    break;

                var found_idx = -1;
                var start_el = -1;

                try {
                    // find a sequence that shares an intersect with what we already have
                    sequences.forEach((seq, seq_idx) => {
                        seq.forEach((el, el_idx) => {
                            var inter = _intersects[el];

                            if (inter.is_over != null) {
                                found_idx = seq_idx;
                                // this will be the first intersecting element we hit, so set next_over
                                // to send it the right way
                                next_over = !inter.is_over;
                                start_el = el_idx;

                                throw "got one!"
                            }
                        });
                    });
                }
                catch (e) {
                    if (e != "got one!")
                        throw e;
                }

                if (found_idx == -1) {
                    // didn't find a connected sequence, take an unconnected one...
                    found_idx = 0;
                    // arbitrary but for consistency
                    next_over = false;
                }

                sequence = sequences[found_idx];
                sequences.splice(found_idx, 1)

                // to make it the first intersect we hit, we first have to move it first
                // otherwise we could hit one from some other loop that we didn't process yet...
                if (start_el != -1) {
                    sequence = [].concat(
                        sequence.slice(start_el),
                        sequence.slice(0, start_el - 1)
                    );
                }
            }

            return ret;
        }
    }
)();