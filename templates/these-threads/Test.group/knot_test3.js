$(document).ready(function() {
    var start = new Date().getTime();


    let el = $(".test-line");

    let svg = add_svg(el,
        new Coord(150, 150),
        new Coord(-150, -200), new Coord(300, 400));

    let drawer = Drawers["cartouche2"];
    let line_thick = drawer.Width;

    let tie1 = MakeRadialTieFromTargetPoint(Ties.radial1,
        new Coord(0, 0),
        new Coord(-1, -1),
        125 - line_thick / 2, line_thick, Drawers.wire,
        "#bob");
    let tie2 = MakeRadialTieFromTargetPoint(Ties.radial1,
        new Coord(0, 0),
        new Coord(1, -1),
        125 - line_thick / 2, line_thick, Drawers.wire,
        "#bob2");

    MakeCartouche(svg, 125, drawer, [tie1, tie2]);

    console.log(new Date().getTime() - start + " ms");
});