$(document).ready(() => {
    DraggablePersp.Set([
        {
            element: $(".scroll-container"),
            dist: 1.0
        },
        {
            element: $(".scroll-container2"),
            dist: 2.0
        },
        {
            element: $(".scroll-container10"),
            dist: 10.0
        },
    ]);
});