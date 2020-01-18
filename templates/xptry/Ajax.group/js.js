function bob(data, status) {
	console.log(status + ": " + data);
}

function bad(hdr, status, error) {
	console.log(status + ": " + error);
}

function jo() {
//	$("#my-div").load("{path='Ajax/decor'}");
    
    var x = $.ajax(
        "{path='Ajax/decor'}",
        {
            success: bob,
            dataType: "json",
            error: bad
        }
	);
}

$(document).ready(jo);
