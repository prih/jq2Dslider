(function($){
	$.fn.slideshow = function(options) {
		if (typeof options.width != 'undefined') {
			this.css('width', options.width+'px');
		}
		if (typeof options.height != 'undefined') {
			this.css('height', options.height+'px');
		}
		if (typeof options.slides != 'undefined') {
			buildSlideHtml(options);
		}
	};

	var buildSlideHtml = function(options) {
		// 
	};
})(jQuery);