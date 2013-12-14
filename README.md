# jQuery 2D slideShow

a two-dimensional slideshow on jquery plugin

## Install

require JS:
```html
<script type="text/javascript" src="js/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="js/jquery-slideshow.js"></script>
```
and CSS:
```html
<link rel="stylesheet" type="text/css" href="css/jquery-slideshow.css">
```

## Introduction

for example:
```
                        slide4
                          |
                          |
slide6 <--- slide3 <--- slide2 <--- [slide1] ---> slide7
                          |
                          |
                        slide5
```

```js
$(document).ready(function(){
	// Example 1: simple slideshow
	$('#slides').slideshow({
		width: 800,
		height: 600,
		slides: [{
			img: 'assets/img1.jpg',
			left: [
				{
					img: 'assets/img2.jpg',
				},
				{
					img: 'assets/img3.jpg',
					up: [
						{
							img: 'assets/img4.jpg',
						}
					],
					down: [
						{
							img: 'assets/img5.jpg',
						}
					]
				},
				{
					img: 'assets/img6.jpg',
				},
			],
			right: [
				{
					img: 'assets/img7.jpg',
				}
			]
		}]
	});
});
```
