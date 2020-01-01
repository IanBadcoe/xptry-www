function MakeParamScaler(interpable) {
    var _lengthish = 0;
    var _interpable = interpable;

    var pp = interpable.Interp(0);

    for(var p = 0; p <= interpable.NumPoints; p++) {
        var hp = p / interpable.NumPoints * interpable.EndParam;

        var cp = interpable.Interp(hp);

        var dx = cp[0] - pp[0];
        var dy = cp[1] - pp[1];

        _lengthish += Math.sqrt(dx * dx + dy * dy);

        pp = cp;
    }

    return {
        get EndParam() {
            return _lengthish;
        },
        get Order() {
            return _interpable.Order;
        },
        get NumPoints() {
            return _interpable.NumPoints;
        },
        get NumKnots() {
            return _interpable.NumKnots;
        },
        Interp: function(p) {
            var hp = p / _lengthish * _interpable.EndParam;

            return _interpable.Interp(hp);
        },
        Point2Param: function(idx) {
            var ip = _interpable.Point2Param(idx);

            return ip / _interpable.EndParam * _lengthish;
        }
    }
}