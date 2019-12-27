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
                        throw "tripple and greater intersections are not supported"
                    }
                });
            });

            var sequence = sequences.pop();
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
            }

            return ret;
        }
    }
)();