$(document).ready(function(){
	// Example 1: simple slideshow
	$('#slides').slideshow({
		width: 800,
		height: 600,
		slides: {
			'slide1': {
				img: 'assets/img1.jpg',
				left: {
					'slide2': {
						img: 'assets/img2.jpg',
					},
					'slide3': {
						img: 'assets/img3.jpg',
						up: {
							'slide4': {
								img: 'assets/img4.jpg',
							}
						},
						down: {
							'slide5': {
								img: 'assets/img5.jpg',
							}
						}
					}
				}
			}
		}
	});
});