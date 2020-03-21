"use strict";

function MakeParamScaler(interpable) {
    let _lengthish = 0;
    let _interpable = interpable;

    let pp = interpable.Interp(0);

    for(let p = 1; p <= interpable.NumPoints; p++) {
        let hp = p / interpable.NumPoints * interpable.EndParam;

        let cp = interpable.Interp(hp);

        let dx = cp[0] - pp[0];
        let dy = cp[1] - pp[1];

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
        Interp(p) {
            let hp = p / _lengthish * _interpable.EndParam;

            return _interpable.Interp(hp);
        },
        Point2Param(idx) {
            let ip = _interpable.Point2Param(idx);

            return ip / _interpable.EndParam * _lengthish;
        }
    }
}