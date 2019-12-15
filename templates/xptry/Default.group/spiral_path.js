$(document).ready(function() {
    // vague idea is to have offscreen and approaching in -ve numbers
    // first clickable item at zero, a few more clickables between zero and some low-ish number
    // (like 3) and then moving off screen again after that...

    var points = [
        [  0, 50,   0],
        [ 10, 45,   0],
        [  0, 40,  10],
        [-10, 40,   0],
        [  0, 40, -10],
        [ 15, 35,   0],
        [  0, 30,  15],
        [-15, 30,   0],
        [  0, 30, -15],
        [  7, 25,   0],
        [  0, 20,   7],
        [ -7, 20,   0],
        [  0, 20,  -7],
        [ 30, 15,   0],
        [  0, 10,  35],
        [-40, 10,   0],
        [  0, 10, -40]
    ];

    var spiral_path = MakeSpline(points, 3);

    insert_clones(".path", ".path", 100);
    apply_path_indices(".path", spiral_path);
	apply_path(".path", spiral_path);
    // apply_path(".article-placement", spiral_path);

    setInterval(function() {
        apply_path(".path", spiral_path, 0.1);
    }, 100);
});
