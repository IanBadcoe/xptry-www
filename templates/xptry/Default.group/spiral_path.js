$(document).ready(function() {
    // vague idea is to have offscreen and approaching in -ve numbers
    // first clickable item at zero, a few more clickables between zero and some low-ish number
    // (like 3) and then moving off screen again after that...

    var points = [
        { pnt: [  0, 50,   0], par: 1 },
        { pnt: [ 10, 45,   0], par: 1 },
        { pnt: [  0, 40,  10], par: 1 },
        { pnt: [-10, 40,   0], par: 1 },
        { pnt: [  0, 40, -10], par: 1 },
        { pnt: [ 15, 35,   0], par: 1 },
        { pnt: [  0, 30,  15], par: 1 },
        { pnt: [-15, 30,   0], par: 1 },
        { pnt: [  0, 30, -15], par: 1 },
        { pnt: [  7, 25,   0], par: 1 },
        { pnt: [  0, 20,   7], par: 1 },
        { pnt: [ -7, 20,   0], par: 1 },
        { pnt: [  0, 20,  -7], par: 1 },
        { pnt: [ 30, 15,   0], par: 10 },
        { pnt: [  0, 10,  35], par: 10 },
        { pnt: [-40, 10,   0], par: 10 },
        { pnt: [  0, 10, -40], Par: 10 }
    ];

    var spiral_path = MakeNonUniformBSplineCombined(points, 3);

    insert_clones(".path", ".path", 100);
    apply_path_indices(".path", spiral_path);
	apply_path(".path", spiral_path);
    // apply_path(".article-placement", spiral_path);

    setInterval(function() {
        apply_path(".path", spiral_path, 0.1);
    }, 100);
});
