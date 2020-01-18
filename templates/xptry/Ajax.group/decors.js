{
	{exp:channel:entries channel='decor' backspace='3'}
		"{title}" : {
			"colour" : "{colour}{colour:colour-hex}{/colour}",
			"left" : {left},
			"top" : {top},
			"images" : [
				{images backspace="6"}
				"{images:file}",
				{/images}
			]
		},
	{/exp:channel:entries}
}