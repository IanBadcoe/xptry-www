$(document).ready(function() {
    // vague idea is to have offscreen and approaching in -ve numbers
    // first clickable item at zero, a few more clickables between zero and some low-ish number
    // (like 3) and then moving off screen again after that...

    // so this scales up from -infinity to 1, then stays at a max radius after that
    function radius(p) {
        if (p < 1)
        {
            return 100 / (3 - p);
        }

        return 50;
    }

    // similarly, we come up from -infinity y to some fixed height at 1
    // but we want about 3 coming items on screen, so scale the height to
    // be about on the lower edge (-50vmin) at -3
    function height(p) {
        if (p < 1) {
            return (p - 1) * 50 / 4;
        }

        return 0;
    }

    function angle(p) {
        return p * Math.PI / 3;
    }

    function spiral_path(p) {
		var a = angle(p);
        var r = radius(p);
        var h = height(p);

		var ret =
		{
			x: Math.sin(a) * r,
            z: Math.cos(a) * r,
            y: h
		};

		return ret;
    }

    insert_clones(".path", ".path", 100);
    apply_path_indices(".path", -4, 0.1);
	apply_path(".path", spiral_path);
	// apply_path(".article-placement", spiral_path);
});
