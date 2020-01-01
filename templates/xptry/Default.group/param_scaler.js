function MakeParamScaler(interpable) {
    var _lengthish = 0;
    var _interpable = interpable;

    var pp = interpable.Interp(interpable.StartParam);

    for(var p = 0; p <= interpable.NumPoints; p++) {
        var hp = interpable.StartParam + p / interpable.NumPoints * interpable.ParamRange;

        var cp = interpable.Interp(hp);

        var dx = cp[0] - pp[0];
        var dy = cp[1] - pp[1];

        _lengthish += Math.sqrt(dx * dx + dy * dy);

        pp = cp;
    }

    return {
        get StartParam() {
            return 0;
        },
        get EndParam() {
            return _lengthish;
        },
        get ParamRange() {
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
            var hp = p / _lengthish * _interpable.ParamRange + _interpable.StartParam;

            return _interpable.Interp(hp);
        },
        Point2Param: function(idx) {
            var ip = _interpable.Point2Param(idx);

            return (ip - _interpable.StartParam) / _interpable.ParamRange * _lengthish;
        }
    }
}