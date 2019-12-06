$(document).ready(function() {
	function apply_path(selector, fn)
	{
		$(".article-placement").each(function(idx) {
			var p = fn(idx);
			$(this).css(
				{
					"left" : p.left,
					"top" : p.top
				}
			);
		});	
	}
	
	function spiral_path(index) {
		var angle = index * Math.PI / 3;
		var rad = vmax(7) * index;
		
		var ret = 
		{
			left: Math.sin(angle) * rad,
			top: Math.cos(angle) * rad
		};
		
		return ret;
	}
	
	apply_path(".article-placement", spiral_path);
});
