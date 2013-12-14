(function($){
	var self = null;
	var width = 0;
	var height = 0;

	$.fn.slideshow = function(options) {
		self = this;

		if (typeof options.width != 'undefined') {
			this.css('width', options.width+'px');
			width = options.width;
		}
		if (typeof options.height != 'undefined') {
			this.css('height', options.height+'px');
			height = options.height;
		}
		if (typeof options.slides != 'undefined' && options.slides.length) {
			createControl();
			checkControlMethod(options.slides[0]);
			cur_slide_arr = options.slides;
			cur_slide_id = 0;
			cur_slide = createSlide(options.slides[0]);
			this.append(cur_slide);
		}
	};

	var cur_slide = null;
	var cur_slide_arr = null;
	var cur_slide_id = null;

	var createSlide = function(slide) {
		var slide_wrap = document.createElement('div');
		slide_wrap.className = 'slide';
		slide_wrap.style.width = width+'px';
		slide_wrap.style.height = height+'px';
		if (typeof slide.img != 'undefined') {
			var img = new Image();
			img.src = slide.img;
			img.width = width;
			slide_wrap.appendChild(img);
		}
		if (typeof slide.html != 'undefined') {
			var slide_html = document.createElement('div');
			slide_html.className = 'slide_text';
			slide_html.innerHTML = slide.html;
			slide_wrap.appendChild(slide_html);
		}
		if (typeof slide.bg != 'undefined') {
			slide_wrap.style.background = slide.bg;
		}

		return slide_wrap;
	};

	var createControl = function() {
		self.append(
			'<div class="control_bar disabled">\
				<div class="left disabled"></div>\
				<div class="right disabled"></div>\
				<div class="up disabled"></div>\
				<div class="down disabled"></div>\
			</div>'
		);
		$('.control_bar div', self).on('click', function(){
			if ($(this).hasClass('left')) chengeSlidesArr('left');
			if ($(this).hasClass('right')) chengeSlidesArr('right');
			if ($(this).hasClass('up')) chengeSlidesArr('up');
			if ($(this).hasClass('down')) chengeSlidesArr('down');
		});
		$(document).on('keydown', function(e){
			switch(e.keyCode) {
				case 37: //left
					$('.control_bar div.left', self).trigger('click');
					break;
				case 39: //right
					$('.control_bar div.right', self).trigger('click');
					break;
				case 38: //up
					$('.control_bar div.up', self).trigger('click');
					break;
				case 40: //down
					$('.control_bar div.down', self).trigger('click');
					break;
			}
		});
		$('.control_bar', self).removeClass('disabled');
	};

	var enableControl = function(type) {
		$('.control_bar div.'+type, self).removeClass('disabled');
	};
	var disableControl = function(type) {
		$('.control_bar div.'+type, self).addClass('disabled');
	};

	var chengeSlidesArr = function(type) {
		var cur = cur_slide_arr[cur_slide_id];
		if (typeof cur[type] != 'undefined') {
			animateNewSlide(cur[type][0], type);
		}
	};

	var animateNewSlide = function(slide, type) {
		var slide_obj = createSlide(slide);
		switch(type) {
			case 'left':
				slide_obj.style.top = 0;
				slide_obj.style.left = '-'+slide_obj.style.width;
				self.append(slide_obj);
				var animate_opt = { left: '+='+width };
				break;
		}
		$('div.slide', self).animate(, {queue: true, duration: 1000, complete: function(){
			if (this == slide_obj) cur_slide = slide_obj; else $(this).remove();
		}});
	};

	var checkControlMethod = function(slide) {
		if (slide['left'] instanceof Array) enableControl('left');
			else disableControl('left');
		if (slide['right'] instanceof Array) enableControl('right');
			else disableControl('right');
		if (slide['up'] instanceof Array) enableControl('up');
			else disableControl('up');
		if (slide['down'] instanceof Array) enableControl('down');
			else disableControl('down');
	};
})(jQuery);