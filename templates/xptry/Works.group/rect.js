class Rect {
    constructor(a, b, c, d) {
        if (arguments.length == 2) {
            a = new Coord(a);
            b = new Coord(b);
        } else if (arguments.length == 4) {
            a = new Coord(a, b);
            b = new Coord(c, d);
        } else if (arguments.length == 0) {
            a = new Coord();
            b = new Coord();
        } else {
            throw "wrong number of arguments";
        }

        this.tl = a.Min(b);
        this.br = a.Max(b);
    }

    // extends by amt in each direction, if amt is a Coord use X and Y separately
    ExtendedBy(amt) {
        if (amt.X === undefined || amt.Y === undefined) {
            amt = new Coord(amt, amt);
        }

        return new Rect(this.tl.Sub(amt), this.br.Add(amt));
    }

    Overlaps(rect) {
        return !this.Disjunct(rect);
    }

    Disjunct(rect) {
        return rect.tl.GTOr(this.br) || rect.br.LTOr(this.tl);
    }

    Dims() {
        return this.br.Sub(this.tl);
    }

    Equal(rect) {
        return this.tl.Equal(rect.tl)
            && this.br.Equal(rect.br);
    }
}