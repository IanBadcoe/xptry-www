$(document).ready(function() {
    let home = function(element) {
        element.append("<p><a onclick='window.SiteNav.SmartNav(\"home-knot\")'>Home</a></p>");
        element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-weeds\")'>The Weeds</a></p>");
        element.append("<p><a onclick='window.SiteNav.SmartNav(\"the-undergrowth\")'>The Undergrowth</a></p>");
    }

    window.Ctors = {
        "home" : home
    }
});