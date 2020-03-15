class Coord extends Array {
    constructor(x, y) {
        super(2);

        if (Array.isArray(x)) {
            this[0] = x[0];
            this[1] = x[1];
        } else {
            this[0] = x || 0;
            this[1] = y || 0;
        }
    }

    Dist() {
        return Math.sqrt(this.Dist2());
    }

    Dist2() {
        return this[0] * this[0] + this[1] * this[1];
    }

    get X() {
        return this[0];
    }

    set X(v) {
        this[0] = v;
    }

    get Y() {
        return this[1];
    }

    set Y(v) {
        this[1] = v;
    }

    Add(v) {
        return new Coord(this[0] + v[0], this[1] + v[1]);
    };

    Inverse() {
        return new Coord(-this[0], -this[1]);
    };

    Sub(v) {
        return new Coord(this[0] - v[0], this[1] - v[1]);
    };

    ToUnit() {
        return this.Div(this.Dist());
    };

    Div(v) {
        return new Coord(this[0] / v, this[1] / v);
    };

    Mult(v) {
        return new Coord(this[0] * v, this[1] * v);
    };

    Dot(v) {
        return new Coord(this[0] * v[0], this[1] * v[1]);
    };

    Cross(v) {
        return this[0] * v[1] - this[1] * v[0];
    };

    Rot90() {
        return new Coord(this[1], -this[0]);
    };

    Rot270() {
        return new Coord(-this[1], this[0]);
    };

    // this.ToArray = function() {
    //     return [this[0], this[1]];
    // }
};

// just a way of easily making an array off Coords at the moment,
// but can add member functions if a need arises
class CoordArray extends Array {
    constructor(ary) {
        if (!isNaN(ary)) {
            super(ary);
        } else {
            super();

            if (ary && Array.isArray(ary)) {
                ary.forEach(x => this.push(new Coord(x)));
            }
        }
    }

    // ToArray() {
    //     return [...this.map(x => x.ToArray())];
    // }

    // map(lambda) {
    //     let ary = super.map(lambda);

    //     return new CoordArray(ary);
    // }
}
