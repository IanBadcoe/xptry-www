$(document).ready(function() {
    function ajax_error(hdr, status, error) {
        alert(status + ": " + error + "\n failed to load data from site, please try reloading...");
    }

    var _decors;
    var _threads;

    function refresh_nav_data(done) {
        var promises = [];
        promises.push(
            $.ajax(
                "{path='Ajax/decors}",
                {
                    success: function(data, status) {
                        _decors = data;
                    },
                    dataType: "json",
                    error: ajax_error
                }
            )
        );
        promises.push(
            $.ajax(
                "{path='Ajax/threads}",
                {
                    success: function(data, status) {
                        _threads = data;
                    },
                    dataType: "json",
                    error: ajax_error
                }
            )
        );

        return Promise.all(promises);
    }

    function done() {
        alert("all over");
    };

    refresh_nav_data().then(done);
});