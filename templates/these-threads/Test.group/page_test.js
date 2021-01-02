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
                width: 400,
                height: 1000,
                position: "absolute"
            });

        div_outer.append(div);

        let t = $("<p>Lorem ipsum dolor sit amet...</p>")
            .addClass("text title");

        div.append(t);

        let text = "<p><u>If it is all a conspiracy...</u><br /><br /><br />"
            + "...it's the conspiracy to bring down crashing<br/>"
            + "those who step from the tenth floor ledge,<br />"
            + "the conspiracy of time to keep on ticking<br />"
            + "whether you have enough of it or not, the con<br />"
            + "of physics offering the same deal to everyone<br />"
            + "on the same conditions, my thrown rock falls down,<br />"
            + "your thrown rock falls down, everybody's rocks fall down<br />"
            + "except when thrown so hard as to exceed<br />"
            + "escape velocity, although there can be no escape<br />"
            + "from a universe fair on every occasion,<br />"
            + "you cannot bluff gravity, nor the conservation of energy,<br />"
            + "all clocks tick the same tick,<br />"
            + "you cannot argue with the virus, can't finesse<br />"
            + "another half an hour of oxygen out of the empty tank,<br />"
            + "you can bank the constants<br />"
            + "of creation, you cannot game this system, cannot bribe<br />"
            + "your experimental aeroplane not to crash<br />"
            + "when your maths is wrong, the virus doesn't hate you,<br />"
            + "and doesn't know what flavour of politics you follow<br />"
            + "or whom you worship, the bacteria do not care,<br />"
            + "by which I mean that caring is simply not a thing for them,<br />"
            + "the virus doesn't <i>want</i> to kill you, doesn't <i>want</i> to spread,<br />"
            + "isn't keeping any score of who's alive and dead,<br />"
            + "the world's a cold and hard and wonderful place,<br />"
            + "and I'm OK with that,<br />"
            + "you'll be all right with a little luck,<br />"
            + "there is no luck,<br />"
            + "that is good:<br />"
            + "you do not want the cosmos playing favourites,<br />"
            + "don't want to guess the rules on a day-to-day basis,<br />"
            + "all Nature is a conspiracy not to care<br />"
            + "and thank goodness for that.</p>";

        text = text.replace(/<br \/>/g, "</p><p>");

        let p1 = $(text)
            .addClass("text");

        div.append(p1);

        return div_outer;
    }

    $(".page-container").append(setup_text());
});
