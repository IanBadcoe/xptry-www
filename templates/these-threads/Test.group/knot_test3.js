$(document).ready(function() {
    var start = new Date().getTime();


    let el = $(".test-line");

    let svg = add_svg(el,
        new Coord(210, 250),
        new Coord(-210, -250), new Coord(420, 500));

    let drawer = Drawers["cartouche2"];
    let line_thick = drawer.Width;

    let tie1 = MakeRadialTieFromTargetPoint(Ties.radial1,
        new Coord(0, 0),
        new Coord(-1, -0.1),
        195 - line_thick / 2 - 2, line_thick, Drawers.wire,
        "#bob");
    let tie2 = MakeRadialTieFromTargetPoint(Ties.radial1,
        new Coord(0, 0),
        new Coord(1, -0.1),
        195 - line_thick / 2 - 2, line_thick, Drawers.wire,
        "#bob2");

    MakeCartouche(svg, 195, drawer, [tie1, tie2], 25, 25);

    console.log(new Date().getTime() - start + " ms");
});