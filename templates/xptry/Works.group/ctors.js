$(document).ready(function() {
    let home = function() {
        return (element, data) => {
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"home-knot\")'>Home</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-weeds\")'>The Weeds</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-undergrowth\")'>The Undergrowth</a></p>");
        };
    }

    let image_field = function(density, min_scale, max_scale, front_edge_perspective_distance) {
        let do_one_image = (element, images, rnd) => {
            let x = rnd.quick() * element.width();
            let y = rnd.quick() * element.height();
            let scale = rnd.quick() * (max_scale - min_scale) + min_scale;
            let persp = 1.0 / (front_edge_perspective_distance + element.height() - y);
            let idx = rnd.quick() * images.length;

            scale *= persp;
            element.append("<img src='" + images[idx] + "' class='nav-image' style='transform:scale(" + scale + ")'>");
        };

        return (element, data) => {
            let area = element.width() * element.height();
            let number = area * density;
            let rnd = MakeRand(element.attr("id"));

            for(let i = 0; i < number; i++) {
                do_one_image(element, data.images, rnd);
            }
        }
    }

    window.Ctors = {
        "home" : home,
        "image_field" : image_field
    }
});