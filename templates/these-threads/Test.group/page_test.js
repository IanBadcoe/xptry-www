$(document).ready(() => {
    PSM.Init(20, $(".scroll-container-container"), 1,
        300, 100);

    let OnResize = () => {
        // auto-scale the page, but continue to respect any zoom the user has already set
        let scale = Math.min(innerHeight, innerWidth) / 700 * PSM.Zoom;

        $(".apply-scale").css({
            transform: "scale(" + scale  + ")"
        });

        PSM.SetScale(1 / scale);
    }

    window.onresize = OnResize;

    OnResize();

    let dl1 = PSM.GetDemandLoader(1.0);

    function setup_text() {
        let div_outer = $("<div/>").addClass("absolute fill click page");

        let div = $("<div/>")
            .css({
                left: 50,
                top: 50,
                bottom: 50,
                right: 50,
                position: "absolute"
            });

        div_outer.append(div);

        let t = $("<p>Lorem ipsum dolor sit amet...</p>")
            .addClass("text title");

        div.append(t);

        let text = "If it is all a conspiracy...\n"
            + "...it's the conspiracy to bring down crashing\n"
            + "those who step from the tenth floor ledge,\n"
            + "the conspiracy of time to keep on ticking\n"
            + "whether you have enough of it or not, the con\n"
            + "of physics offering the same deal to everyone\n"
            + "on the same conditions, my thrown rock falls down,\n"
            + "your thrown rock falls down, everybody's rocks fall down\n"
            + "except when thrown so hard as to exceed\n\n"
            + "escape velocity, although there can be no escape\n"
            + "from a universe fair on every occasion,\n"
            + "you cannot bluff gravity, nor the conservation of energy,\n"
            + "all clocks tick the same tick,\n"
            + "you cannot argue with the virus, can't finesse\n"
            + "another half an hour of oxygen out of the empty tank,\n"
            + "you can bank the constants\n"
            + "of creation, you cannot game this system, cannot bribe\n\n"
            + "your experimental aeroplane not to crash\n"
            + "when your maths is wrong, the virus doesn't hate you,\n\n\n\n\n\n\n"
            + "and doesn't know what flavour of politics you follow\n"
            + "or whom you worship, the bacteria do not care,\n"
            + "by which I mean that caring is simply not a thing for them,\n"
            + "the virus doesn't want to kill you, doesn't want to spread,\n"
            + "isn't keeping any score of who's alive and dead,\n"
            + "the world's a cold and hard and wonderful place,\n"
            + "and I'm OK with that,\n"
            + "you'll be all right with a little luck,\n"
            + "there is no luck,\n"
            + "that is good:\n"
            + "you do not want the cosmos playing favourites,\n"
            + "don't want to guess the rules on a day-to-day basis,\n"
            + "all Nature is a conspiracy not to care\n"
            + "and thank goodness for that.";

        PDL.FormatIntoContainer(div, text, "text");

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
