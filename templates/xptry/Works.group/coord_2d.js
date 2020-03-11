function Coord(x, y) {
    this[0] = 0;
    this[1] = 0;

    if (Array.isArray(x)) {
        this[0] = x[0];
        this[1] = x[1];
    } else if (x != undefined && y != undefined) {
        this[0] = x;
        this[1] = y;
    }

    this.Dist = function() {
        return Math.sqrt(this.Dist2());
    }

    this.Dist2 = function() {
        return this[0] * this[0] + this[1] * this[1];
    }

    Object.defineProperty(this, 'X', {
        get: function() { return this[0]; },
        set: function(v) { this[0] = v; }
    });

    Object.defineProperty(this, 'Y', {
        get: function() { return this[1]; },
        set: function(v) { this[1] = v; }
    });

    this.Add = function(v) {
        return new Coord(this[0] + v[0], this[1] + v[1]);
    };

    this.Inverse = function() {
        return new Coord(-this[0], -this[1]);
    };

    this.Sub = function(v) {
        return new Coord(this[0] - v[0], this[1] - v[1]);
    };

    this.ToUnit = function() {
        return this.Div(this.Dist());
    };

    this.Div = function(v) {
        return new Coord(this[0] / v, this[1] / v);
    };

    this.Mult = function(v) {
        return new Coord(this[0] * v, this[1] * v);
    };

    this.Dot = function(v) {
        return new Coord(this[0] * v[0], this[1] * v[1]);
    };

    this.Cross = function(v) {
        return this[0] * v[1] - this[1] * v[0];
    };

    this.Rot90 = function() {
        return new Coord(this[1], -this[0]);
    };

    this.Rot270 = function() {
        return new Coord(-this[1], this[0]);
    };
};