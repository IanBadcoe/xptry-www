{
	{exp:channel:entries channel='decor' backspace='3'}
		"{url_title}" : {
            "title" : "{title}",
			"colour" : "{colour}{colour:colour-hex}{/colour}",
			"centre_x" : {centre_x},
			"centre_y" : {centre_y},
			"width" : {width},
			"height" : {height},
			"images" : [
				{images backspace="6"}
				"{images:file}",
				{/images}
			],
            "ctor" : "{ctor}"
		},
	{/exp:channel:entries}
}