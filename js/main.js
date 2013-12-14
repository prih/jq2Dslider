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