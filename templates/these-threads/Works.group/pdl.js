"use strict";

// reformat a simple markdown-like language into poetry layouts
// limitations:
// linear poetry, not too funky in the formatting
// start simple and add more features as required
$(document).ready(() => {
    let fx = [ "b", "u", "i", "t", ];

    let fx_regexp = /(?<!\\)\[([a-z])(?:=([.,0-9- ]+))?\]/;

    let parse_args = text => {
        text = text.replace(" ", "");
        let terms = text.split(",");

        return terms.map(x => {
            if (!x) return null;

            return parseFloat(x);
        });
    }

    let fx_spotter = text => {
        let where = text.length + 1;
        let found = null;
        let args = [];
        let len = 0;

        // temporarily nuke any escaped backslashes
        text = text.replace(/\\\\/g, "--");

        let m = text.match(fx_regexp);

        if (m) {
            found = m[1];
            where = m.index;
            if (m[2]) {
                args = parse_args(m[2]);
            }
            len = m[0].length;
        }

        // for the moment all lengths are 3, but return ut in case we change later...
        return [found, where, len, args];
    };

    let find_strophe = text => {
        let where = text.indexOf("\n\n");
        let ret;
        let gap_after = 1;

        if (where == -1) {
            ret = text;
            text = "";
        } else {
            ret = text.substring(0, where);
            text = text.substring(where + 2);

            while(text.charAt(0) == "\n") {
                text = text.substring(1);
                gap_after++;
            }
        }

        return [text, ret, gap_after];
    };

    let find_line = text => {
        let where = text.indexOf("\n");
        let ret;

        if (where == -1) {
            ret = text;
            text = "";
        } else {
            ret = text.substring(0, where);
            text = text.substring(where + 1);
        }

        return [text, ret];
    };

    let remove_fx = (fx_stack, above_index) => {
        above_index = above_index || 0;

        let ret = "";

        fx_stack.slice(above_index).forEach(x => {
            ret += "</" + x + ">";
        });

        return ret;
    }

    let add_fx = (fx_stack, above_index) => {
        above_index = above_index || 0;

        let ret = "";

        fx_stack.slice(above_index).forEach(x => {
            ret += "<" + x + ">";
        });

        return ret;
    }

    let process_line_style = (what, args, line_styles) => {
        switch(what) {
            case "t":
                if (args.length && args[0]) {
                    line_styles["margin-left"] = "" + args[0] + "em";
                } else {
                    // default tab
                    line_styles["margin-left"] = "" + "3em";
                }

                return true;

            case "n":
                if (args.length >= 2) {
                    line_styles["position"] = "relative";
                    line_styles["left"] = "" + (args[0] || 0) + "em";
                    line_styles["top"] = "" + (args[1] || 0) + "em";

                    return true;
                }

                break;
            }

        return false;
    }

    let process_div_style = (what, args, div_styles) => {
        switch(what) {
            case "a":
                if (args.length >= 2) {
                    div_styles["position"] = "absolute";
                    div_styles["left"] = "" + (args[0] || 0) + "em";
                    div_styles["top"] = "" + (args[1] || 0) + "em";

                    return true;
                }

                break;

            case "r":
                div_styles["text-align"] = "right";

                return true;

            case "c":
                div_styles["text-align"] = "center";

                return true;
            }

        return false;
    }

    let process_fx = (text, fx_stack, line_styles, div_styles) => {
        // reapply any on-going fx
        let ret = add_fx(fx_stack);

        while(text.length) {
            let [what, where, len, args] = fx_spotter(text);

            if (!what) {
                // no fx, paste everything and exit
                ret = ret + text;
                text = "";
            }
            else
            {
                // take all the text up to the fx
                ret = ret + text.substring(0, where);

                if (!process_line_style(what, args, line_styles)
                    && !process_div_style(what, args, div_styles)) {
                    let stack_pos = fx_stack.indexOf(what);

                    if (stack_pos == -1) {
                        fx_stack.push(what);

                        ret = ret + "<" + what + ">";
                    }
                    else
                    {
                        // we need to turn off any existant fx nested inside the one we are turning off, then turn off the one, then turn the others back on...

                        // turn off everything above us in the stack
                        ret += remove_fx(fx_stack, stack_pos + 1);

                        // turn us off
                        ret += "</" + what + ">";

                        // take us out of the stack
                        fx_stack.splice(stack_pos, 1);

                        // turn the other on again
                        ret += add_fx(fx_stack, stack_pos);
                    }
                }

                text = text.substring(where + len);
            }
        }

        // turn off any on-going fx
        ret += remove_fx(fx_stack);

        return ret;
    };

    let process_escapes = text => {
        let prev_backslash = false;
        let ret = "";

        for(let i = 0; i < text.length; i++) {
            let char = text.charAt(i);

            if (char == "\\") {
                if (prev_backslash) {
                    ret += "\\";
                    prev_backslash = false;
                }
                else
                {
                    prev_backslash = true;
                }
            }
            else
            {
                ret += char;
                prev_backslash = false;
            }
        }

        return ret;
    };

    window.PDL = {
        FormatIntoContainer(el, text) {
            text = text.replace(/\r\n/g, "\n");

            while(text.length) {
                let fx_stack = [];

                let strophe, gap_after;
                [text, strophe, gap_after] = find_strophe(text);

                // discard any empty strophes, if we need bigger breaks between
                // strophes, then we do that by counting extra blank-lines and setting class poem-gap[1,2,3,4,5] on the strophe we have, rather than
                // emiting empty ones
                if (strophe.length) {
                    let div = $("<div/>");
                    div.addClass("poem-strophe");
                    gap_after = Math.min(gap_after, 5);
                    div.addClass("poem-gap" + gap_after);

                    let div_styles = {};

                    while(strophe.length) {
                        let line;
                        let line_styles = {};

                        [strophe, line] = find_line(strophe);

                        let built_line = process_fx(line, fx_stack, line_styles, div_styles);
                        built_line = process_escapes(built_line);

                        let p = $("<p>" + built_line + "</p>");
                        p.addClass("poem-line");
                        p.css(line_styles);

                        div.append(p);
                    }

                    div.css(div_styles);

                    el.append(div);
                }
            }
        }
    };
});