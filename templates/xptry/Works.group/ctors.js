$(document).ready(function() {
    let home = function() {
        return (element, data) => {
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"home-knot\")'>Home</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-weeds\")'>The Weeds</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-undergrowth\")'>The Undergrowth</a></p>");
        };
    }

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance, aspect) {
        let do_one_image = (element, images, rnd, width, height) => {
            let x = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * width;
            let y = (rnd.quick() + rnd.quick() + rnd.quick()) / 3 * height;
            let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
            let persp = front_edge_perspective_distance / (front_edge_perspective_distance + height - y);
            let idx = Math.floor(rnd.quick() * images.length);

            scale *= persp;

            x = (x - width / 2) * persp + width / 2;
            y = (y - height / 2) * persp + height / 2;

            let ne = $("<img src='" + images[idx] + "'>").attr({
                class: "absolute zero-spacing"
            });

            ne.on("load", (event) => {
                let hx = x - ne.width() / 2;
                let hy = y - ne.height() / 2;

                ne.css({
                    transform: "translate(" + hx + "px, " + hy + "px) scale(" + scale + ", " + scale * aspect + ")",
                });
            });

            element.append(ne);
        };

        return (element, data) => {
            let area = data.width * data.height;
            let number = area * density;
            let rnd = MakeRand(element.attr("id"));

            for(let i = 0; i < number; i++) {
                do_one_image(element, data.images, rnd, data.width, data.height);
            }
        }
    }

    window.Ctors = {
        "home" : home,
        "image_field" : image_field
    }
});