// reformat a simple markdown-like language into poetry layouts
// limitations:
// linear poetry, not too funky in the formatting
// start simple and add more features as required
$(document).ready(() => {
    let find_strophe = text => {
        let where = text.indexOf("\n\n");
        let ret;

        if (where == -1) {
            ret = text;
            text = "";
        } else {
            ret = text.substring(0, where);
            text = text.substring(where);

            while(text.charAt(0) == "\n") {
                text = text.substring(1);
            }
        }

        return [text, ret];
    };

    window.PDL = {
        FormatIntoContainer(el, text, klass) {
            text = text.replace(/\r\n/g, "\n");

            while(text.length) {
                let strophe;
                [text, strophe] = find_strophe(text);

                // discard any empty strophes, if we need bigger breaks between
                // strophes, then let's do that by counting extra blank-lines and annotating the strophe we have, rather than
                // emiting empty ones
                if (strophe.length) {
                    strophe = strophe.replace(/\n/g, "<br/>");

                    let p = $("<p/>");
                    p.html(strophe);

                    if (klass)
                        p.addClass(klass);

                    el.append(p);
                }
            }
        }
    };
});