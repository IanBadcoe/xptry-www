class Rect {
    constructor(a, b, c, d) {
        if (arguments.length === 2) {
            a = new Coord(a);
            b = new Coord(b);
        } else if (arguments.length === 4) {
            a = new Coord(a, b);
            b = new Coord(c, d);
        } else if (arguments.length === 0) {
            a = new Coord();
            b = new Coord();
        } else {
            throw "wrong number of arguments";
        }

        this.TL = a.Min(b);
        this.BR = a.Max(b);
    }

    // extends by amt in each direction, if amt is a Coord use X and Y separately
    ExtendedBy(amt) {
        if (amt.X === undefined || amt.Y === undefined) {
            amt = new Coord(amt, amt);
        }

        return new Rect(this.TL.Sub(amt), this.BR.Add(amt));
    }

    Overlaps(rect) {
        return !this.Disjunct(rect);
    }

    Disjunct(rect) {
        return rect.TL.GTOr(this.BR) || rect.BR.LTOr(this.TL);
    }

    Dims() {
        return this.BR.Sub(this.TL);
    }

    Equal(rect) {
        return this.TL.Equal(rect.TL)
            && this.BR.Equal(rect.BR);
    }

    get TR() {
        return new Coord(this.BR.X, this.TL.Y);
    }

    get BL() {
        return new Coord(this.TL.X, this.BR.Y);
    }

    get T() {
        return this.TL.Y;
    }

    get L() {
        return this.TL.X;
    }

    get B() {
        return this.BR.Y;
    }

    get R() {
        return this.BR.X;
    }
}