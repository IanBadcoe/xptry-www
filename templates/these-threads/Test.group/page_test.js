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

        let text = "PDL :-)...\n"
            + "Just type lines and hit enter at the end.\n"
            + "Keep doing this to add to a strophe.\n"
            + "Hit enter twice to end the strophe.\n\n"
            + "Hit enter extra times for more space after the strophe.\n\n\n\n\n"
            + "Surround text in \\[b][b]these for bold[b]\\[b]\n"
            + "and \\[i][i]these for italic[i]\\[i]\n"
            + "and \\[u][u]these for underlined[u]\\[u].\n\n"
            + "(Use combinations to get multiple font effects at \\[b]\\[u][b][u]once\n"
            + "they continue, line-to-line, but not across strophes.\n"
            + "It does not matter \\[b][b]what order you apply and\\[u][u] remove them.)\n\n"
            + "\\[c][c] to centre a strophe.\n\n"
            + "\\[r][r] to right-align it.\n\n"
            + "\\[t=3][t=3]To tab-in a whole strophe.\n\n"
            + "\\[t=4][t=4]The number is the amount of tabbing in emdash widths.\n\n"
            + "\\[n=x,y]To nudge the position of a strophe away from its natural position, again in emdashes.  e.g:\n\n"
            + "\\[n=0,1][n=0,1] - down\n\n"
            + "\\[n=0,-1][n=0,-1] - up\n\n"
            + "\\[n=1,0][n=1,0] - right\n\n"
            + "\\[n=-1,0][n=-1,0] - left\n\n"
            + "\\[a=30,10][a=30,10]To just\nput\na strophe\nat an absolute position on the page\n(in emdashes from the top left).\n\n"
            + "[b]whether [u]you [i]have[b] enough[u] of[i] it or not, the con\n"
            + "of physics offering the same deal to everyone\n"
            + "your thrown rock falls down, everybody's rocks fall down\n"
            + "except when thrown so hard as to exceed\n\n"
            + "escape velocity, although there can be no escape\n"
            + "from a universe fair on every occasion,\n"
            + "you cannot bluff gravity, nor the conservation of energy,\n"
            + "all clocks [b]tick the same tick,\n"
            + "you cannot argue[b] with the virus, can't finesse\n"
            + "another half an hour of oxygen out of the empty tank,\n"
            + "you can [t=3]bank the constants\n"
            + "of creation, you cannot game this system, [b]cannot bribe\n\n"
            + "[n=50,50]your experimental aeroplane not to crash\n"
            + "on the [b]same conditions[b], [u]my[u] [i]thrown rock[i] falls down,\n"
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
