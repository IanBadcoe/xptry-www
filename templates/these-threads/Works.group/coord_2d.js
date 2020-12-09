class Coord extends Array {
    constructor(x, y) {
        super(2);

        if (Array.isArray(x)) {
            $.extend(this, x);
        } else {
            this[0] = x || 0;
            this[1] = y || 0;
        }
    }

    Length() {
        return Math.sqrt(this.Length2());
    }

    Length2() {
        return this[0] * this[0] + this[1] * this[1];
    }

    Dist(v) {
        return this.Sub(v).Length();
    }

    Dist2(v) {
        return this.Sub(v).Length2();
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
        return this.Div(this.Length());
    };

    Div(v) {
        return new Coord(this[0] / v, this[1] / v);
    };

    Mult(v) {
        return new Coord(this[0] * v, this[1] * v);
    };

    Project(v) {
        return new Coord(this[0] * v[0], this[1] * v[1]);
    };

    Dot(v) {
        return this[0] * v[0] + this[1] * v[1];
    };

    // a cross b gives positive if trating as vectors, a to b is a positive angle
    // allowing for y being down on screen (thus [0,1].Cross([1,0]) is -1 [1,0].Cross[0,1] is 1:
    //
    //   .--[1,0]-->
    //   |
    // [0,1]
    //   |
    //   v
    Cross(v) {
        return this[0] * v[1] - this[1] * v[0];
    };

    Rot90() {
        return new Coord(this[1], -this[0]);
    };

    Rot270() {
        return new Coord(-this[1], this[0]);
    };

    // see comment on Cross, above
    SignedAngle(v) {
        let tu = this.ToUnit();
        let vu = v.ToUnit();

        let cos = tu.Dot(vu);
        let ang = Math.acos(cos);

        let cross = tu.Cross(vu);

        if (cross < 0) {
            return -ang;
        }

        return ang;
    }

    Angle(v) {
        let tu = this.ToUnit();
        let vu = v.ToUnit();

        let cos = tu.Dot(vu);
        return Math.acos(cos);
    }

    GTAnd(c) {
        return this.X > c.X
            && this.Y > c.Y;
    }

    GTOr(c) {
        return this.X > c.X
            || this.Y > c.Y;
    }

    LTAnd(c) {
        return this.X < c.X
            && this.Y < c.Y;
    }

    LTOr(c) {
        return this.X < c.X
            || this.Y < c.Y;
    }

    Equal(c) {
        return this[0] === c[0]
            && this[1] === c[1];
    }

    Max(c) {
        return new Coord(Math.max(this.X, c.X), Math.max(this.Y, c.Y));
    }

    Min(c) {
        return new Coord(Math.min(this.X, c.X), Math.min(this.Y, c.Y));
    }

    Rotate(angle) {
        let ca = Math.cos(angle);
        let sa = Math.sin(angle);

        return new Coord(this.X * ca + this.Y * -sa,
            this.X * sa + this.Y * ca);
    }

    MirrorY() {
        return new Coord(this.X, -this.Y);
    }

    MirrorX() {
        return new Coord(-this.X, this.Y);
    }

    static Zero = new Coord(0, 0);
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

    push(v) {
        super.push(new Coord(v));
    }

    // ToArray() {
    //     return [...this.map(x => x.ToArray())];
    // }

    // map(lambda) {
    //     let ary = super.map(lambda);

    //     return new CoordArray(ary);
    // }
}
