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
			objectQueue.push(options.slides);
			while( indexObjectModel() ) {};
			
			createControl();
			checkControlMethod(options.slides[0]);
			cur_slide_arr = options.slides;
			cur_slide_id = 0;
			cur_slide = createSlide(options.slides[0]);
			this.append(cur_slide);
		}
	};

	var objectQueue = [];

	var indexObjectModel = function() {
		if (!objectQueue.length) return false;
		var obj = objectQueue.shift();
		if (obj instanceof Array) {
			for (var i = 0; i < obj.length; i++) {
				obj[i].parent_arr = obj;
				obj[i].my_num = i;
				if (typeof obj[i]['left'] != 'undefined') {
					obj[i]['left'].my_type = 'left';
					objectQueue.push(obj[i]['left']);
					if (obj[i]['left'][0]) obj[i]['left'][0]['right'] = obj[i];
				}
				if (typeof obj[i]['right'] != 'undefined') {
					obj[i]['right'].my_type = 'right';
					objectQueue.push(obj[i]['right']);
					if (obj[i]['right'][0]) obj[i]['right'][0]['left'] = obj[i];
				}
				if (typeof obj[i]['up'] != 'undefined') {
					obj[i]['up'].my_type = 'up';
					objectQueue.push(obj[i]['up']);
					if (obj[i]['up'][0]) obj[i]['up'][0]['down'] = obj[i];
				}
				if (typeof obj[i]['down'] != 'undefined') {
					obj[i]['down'].my_type = 'down';
					objectQueue.push(obj[i]['down']);
					if (obj[i]['down'][0]) obj[i]['down'][0]['up'] = obj[i];
				}
			}
			return true;
		}
		return false;
	};

	var cur_slide = null;
	var cur_slide_arr = null;
	var cur_slide_id = null;
	var work_animate = false;

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
			if (!work_animate) {
				if ($(this).hasClass('left')) chengeSlide('left');
				if ($(this).hasClass('right')) chengeSlide('right');
				if ($(this).hasClass('up')) chengeSlide('up');
				if ($(this).hasClass('down')) chengeSlide('down');
			}
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

	var chengeSlide = function(type) {
		var cur = cur_slide_arr[cur_slide_id];
		if (typeof cur[type] != 'undefined') {
			if (cur[type] instanceof Array) {
				animateNewSlide(cur[type][0], type);
				cur_slide_id = 0;
				cur_slide_arr = cur[type];
				checkControlMethod(cur[type][0]);
			} else {
				animateNewSlide(cur[type], type);
				cur_slide_id = cur[type].my_num;
				cur_slide_arr = cur[type].parent_arr;
				checkControlMethod(cur[type]);
			}
		} else {
			if (cur.parent_arr instanceof Array) {
				if (cur.my_num < cur.parent_arr.length-1) {
					if (cur.parent_arr.my_type == type)
						animateNewSlide(cur.parent_arr[++cur_slide_id], cur.parent_arr.my_type);
					if (
						   (cur.parent_arr.my_type == 'left' && type == 'right')
						|| (cur.parent_arr.my_type == 'up' && type == 'down')
						|| (cur.parent_arr.my_type == 'right' && type == 'left')
						|| (cur.parent_arr.my_type == 'down' && type == 'up')
					) {
						if (cur_slide_id > 0)
							animateNewSlide(cur.parent_arr[--cur_slide_id], type);
					}
				}
				if (cur.my_num == cur.parent_arr.length-1) {
					if (cur.parent_arr.my_type == 'left' && type == 'right')
						animateNewSlide(cur.parent_arr[--cur_slide_id], 'right');
					if (cur.parent_arr.my_type == 'right' && type == 'left')
						animateNewSlide(cur.parent_arr[--cur_slide_id], 'left');
					if (cur.parent_arr.my_type == 'up' && type == 'down')
						animateNewSlide(cur.parent_arr[--cur_slide_id], 'down');
					if (cur.parent_arr.my_type == 'down' && type == 'up')
						animateNewSlide(cur.parent_arr[--cur_slide_id], 'up');
				}
			}
			checkControlMethod(cur.parent_arr[cur_slide_id]);
		}
	};

	var animateNewSlide = function(slide, type, cb) {
		var slide_obj = createSlide(slide);
		switch(type) {
			case 'left':
				slide_obj.style.top = 0;
				slide_obj.style.left = '-'+slide_obj.style.width;
				self.append(slide_obj);
				var animate_opt = { left: '+='+width };
				break;
			case 'right':
				slide_obj.style.top = 0;
				slide_obj.style.left = slide_obj.style.width;
				self.append(slide_obj);
				var animate_opt = { left: '-='+width };
				break;
			case 'up':
				slide_obj.style.top = '-'+slide_obj.style.height;
				slide_obj.style.left = 0;
				self.append(slide_obj);
				var animate_opt = { top: '+='+height };
				break;
			case 'down':
				slide_obj.style.top = slide_obj.style.height;
				slide_obj.style.left = 0;
				self.append(slide_obj);
				var animate_opt = { top: '-='+height };
				break;
		}
		$('div.slide', self).animate(animate_opt, {queue: true, duration: 1000, complete: function(){
			if (this == slide_obj) {
				cur_slide = slide_obj;
			} else $(this).remove();
		}});
	};

	var checkControlMethod = function(slide) {
		if (typeof slide['left'] != 'undefined') enableControl('left');
			else disableControl('left');
		if (typeof slide['right'] != 'undefined') enableControl('right');
			else disableControl('right');
		if (typeof slide['up'] != 'undefined') enableControl('up');
			else disableControl('up');
		if (typeof slide['down'] != 'undefined') enableControl('down');
			else disableControl('down');

		if (slide.parent_arr instanceof Array) {
			if (slide.my_num < slide.parent_arr.length-1) {
				enableControl(slide.parent_arr.my_type);
			}
			if (slide.my_num == slide.parent_arr.length-1 || slide.my_num > 0) {
				if (slide.parent_arr.my_type == 'left') enableControl('right');
				if (slide.parent_arr.my_type == 'right') enableControl('left');
				if (slide.parent_arr.my_type == 'up') enableControl('down');
				if (slide.parent_arr.my_type == 'down') enableControl('up');
			}
		}
	};
})(jQuery);