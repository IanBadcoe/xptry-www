class Rect {
    constructor(a, b, c, d) {
        if (arguments.length == 2) {
            this.tl = new Coord(a);
            this.br = new Coord(b);
        } else if (arguments.length == 4) {
            this.tl = new Coord(a, b);
            this.br = new Coord(c, d);
        } else if (arguments.length == 0) {
            this.tl = new Coord();
            this.br = new Coord();
        } else {
            throw "wrong number of arguments";
        }
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