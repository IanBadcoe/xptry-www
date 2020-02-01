$(document).ready(function() {
    let home = function() {
        return (element, data) => {
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"home-knot\")'>Home</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-weeds\")'>The Weeds</a></p>");
            element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-undergrowth\")'>The Undergrowth</a></p>");
        };
    }

    let image_field = function(element, data) {

    }

    window.Ctors = {
        "home" : home
    }
});