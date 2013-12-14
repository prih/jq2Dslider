(function($){
	$.fn.slideshow = function(options) {
		if (typeof options.width != 'undefined') {
			this.css('width', options.width+'px');
		}
		if (typeof options.height != 'undefined') {
			this.css('height', options.height+'px');
		}
		if (typeof options.slides != 'undefined' && options.slides.length) {
			var slider = new Slider(this, options);

			slider.objectQueue.push(options.slides);
			while( slider.indexObjectModel() ) {};
			
			slider.createControl();
			slider.checkControlMethod(options.slides[0]);
			slider.cur_slide_arr = options.slides;
			slider.cur_slide_id = 0;
			slider.cur_slide = slider.createSlide(options.slides[0]);
			this.append(slider.cur_slide);
		}
	};

	var Slider = function(dom_obj, options) {
		var self = this;
		this.options = options;
		this.dom_obj = dom_obj;

		this.objectQueue = [];

		var obj_id = 0;

		this.indexObjectModel = function() {
			if (!self.objectQueue.length) return false;
			var obj = self.objectQueue.shift();
			if (obj instanceof Array) {
				for (var i = 0; i < obj.length; i++) {
					obj[i].parent_arr = obj;
					obj[i].my_num = i;
					obj[i].my_id = ++obj_id;
					if (typeof obj[i]['left'] != 'undefined') {
						obj[i]['left'].my_type = 'left';
						self.objectQueue.push(obj[i]['left']);
						if (obj[i]['left'][0]) obj[i]['left'][0]['right'] = obj[i];
					}
					if (typeof obj[i]['right'] != 'undefined') {
						obj[i]['right'].my_type = 'right';
						self.objectQueue.push(obj[i]['right']);
						if (obj[i]['right'][0]) obj[i]['right'][0]['left'] = obj[i];
					}
					if (typeof obj[i]['up'] != 'undefined') {
						obj[i]['up'].my_type = 'up';
						self.objectQueue.push(obj[i]['up']);
						if (obj[i]['up'][0]) obj[i]['up'][0]['down'] = obj[i];
					}
					if (typeof obj[i]['down'] != 'undefined') {
						obj[i]['down'].my_type = 'down';
						self.objectQueue.push(obj[i]['down']);
						if (obj[i]['down'][0]) obj[i]['down'][0]['up'] = obj[i];
					}
				}
				return true;
			}
			return false;
		};

		this.cur_slide = null;
		this.cur_slide_arr = null;
		this.cur_slide_id = null;
		this.work_animate = false;

		this.slidesCache = {};

		this.createSlide = function(slide) {
			if (typeof self.slidesCache[slide.my_id] != 'undefined') {
				return self.slidesCache[slide.my_id];
			}

			var slide_wrap = document.createElement('div');
			slide_wrap.className = 'slide';
			slide_wrap.style.width = self.options.width+'px';
			slide_wrap.style.height = self.options.height+'px';
			if (typeof slide.img != 'undefined') {
				var img = new Image();
				img.src = slide.img;
				img.width = self.options.width;
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

			var wrap = document.createElement('div');
			wrap.appendChild(slide_wrap);

			return wrap.innerHTML;
		};

		this.createControl = function() {
			self.dom_obj.append(
				'<div class="control_bar disabled">\
					<div class="left disabled"></div>\
					<div class="right disabled"></div>\
					<div class="up disabled"></div>\
					<div class="down disabled"></div>\
				</div>'
			);
			$('.control_bar div', self.dom_obj).on('click', function(){
				if (!self.work_animate) {
					if ($(this).hasClass('left')) self.chengeSlide('left');
					if ($(this).hasClass('right')) self.chengeSlide('right');
					if ($(this).hasClass('up')) self.chengeSlide('up');
					if ($(this).hasClass('down')) self.chengeSlide('down');
				}
			});
			$(document).on('keydown', function(e){
				switch(e.keyCode) {
					case 37: //left
						$('.control_bar div.left', self.dom_obj).trigger('click');
						break;
					case 39: //right
						$('.control_bar div.right', self.dom_obj).trigger('click');
						break;
					case 38: //up
						$('.control_bar div.up', self.dom_obj).trigger('click');
						break;
					case 40: //down
						$('.control_bar div.down', self.dom_obj).trigger('click');
						break;
				}
			});
			$('.control_bar', self.dom_obj).removeClass('disabled');
		};

		this.enableControl = function(type) {
			$('.control_bar div.'+type, self.dom_obj).removeClass('disabled');
		};
		this.disableControl = function(type) {
			$('.control_bar div.'+type, self.dom_obj).addClass('disabled');
		};

		this.chengeSlide = function(type) {
			var cur = self.cur_slide_arr[self.cur_slide_id];
			if (typeof cur[type] != 'undefined') {
				if (cur[type] instanceof Array) {
					self.animateNewSlide(cur[type][0], type);
					self.cur_slide_id = 0;
					self.cur_slide_arr = cur[type];
					self.checkControlMethod(cur[type][0]);
				} else {
					self.animateNewSlide(cur[type], type);
					self.cur_slide_id = cur[type].my_num;
					self.cur_slide_arr = cur[type].parent_arr;
					self.checkControlMethod(cur[type]);
				}
			} else {
				if (cur.parent_arr instanceof Array) {
					if (cur.my_num < cur.parent_arr.length-1) {
						if (cur.parent_arr.my_type == type)
							self.animateNewSlide(cur.parent_arr[++self.cur_slide_id], cur.parent_arr.my_type);
						if (
							   (cur.parent_arr.my_type == 'left' && type == 'right')
							|| (cur.parent_arr.my_type == 'up' && type == 'down')
							|| (cur.parent_arr.my_type == 'right' && type == 'left')
							|| (cur.parent_arr.my_type == 'down' && type == 'up')
						) {
							if (self.cur_slide_id > 0)
								self.animateNewSlide(cur.parent_arr[--self.cur_slide_id], type);
						}
					}
					if (cur.my_num == cur.parent_arr.length-1) {
						if (cur.parent_arr.my_type == 'left' && type == 'right')
							self.animateNewSlide(cur.parent_arr[--self.cur_slide_id], 'right');
						if (cur.parent_arr.my_type == 'right' && type == 'left')
							self.animateNewSlide(cur.parent_arr[--self.cur_slide_id], 'left');
						if (cur.parent_arr.my_type == 'up' && type == 'down')
							self.animateNewSlide(cur.parent_arr[--self.cur_slide_id], 'down');
						if (cur.parent_arr.my_type == 'down' && type == 'up')
							self.animateNewSlide(cur.parent_arr[--self.cur_slide_id], 'up');
					}
				}
				if (typeof cur.parent_arr[self.cur_slide_id] != 'undefined')
					self.checkControlMethod(cur.parent_arr[self.cur_slide_id]);
			}
		};

		this.animateNewSlide = function(slide, type, cb) {
			var slide_text = self.createSlide(slide);
			var slide_obj = $(slide_text)[0];
			switch(type) {
				case 'left':
					slide_obj.style.top = 0;
					slide_obj.style.left = '-'+slide_obj.style.width;
					self.dom_obj.append(slide_obj);
					var animate_opt = { left: '+='+self.options.width };
					break;
				case 'right':
					slide_obj.style.top = 0;
					slide_obj.style.left = slide_obj.style.width;
					self.dom_obj.append(slide_obj);
					var animate_opt = { left: '-='+self.options.width };
					break;
				case 'up':
					slide_obj.style.top = '-'+slide_obj.style.height;
					slide_obj.style.left = 0;
					self.dom_obj.append(slide_obj);
					var animate_opt = { top: '+='+self.options.height };
					break;
				case 'down':
					slide_obj.style.top = slide_obj.style.height;
					slide_obj.style.left = 0;
					self.dom_obj.append(slide_obj);
					var animate_opt = { top: '-='+self.options.height };
					break;
			}
			$('div.slide', self.dom_obj).animate(animate_opt, {queue: true, duration: 1000, complete: function(){
				if (this == slide_obj) {
					self.cur_slide = slide_obj;
				} else $(this).remove();
			}});
		};

		this.checkControlMethod = function(slide) {
			if (typeof slide['left'] != 'undefined') self.enableControl('left');
				else self.disableControl('left');
			if (typeof slide['right'] != 'undefined') self.enableControl('right');
				else self.disableControl('right');
			if (typeof slide['up'] != 'undefined') self.enableControl('up');
				else self.disableControl('up');
			if (typeof slide['down'] != 'undefined') self.enableControl('down');
				else self.disableControl('down');

			if (slide.parent_arr instanceof Array) {
				if (slide.my_num < slide.parent_arr.length-1) {
					self.enableControl(slide.parent_arr.my_type);
				}
				if (slide.my_num == slide.parent_arr.length-1 || slide.my_num > 0) {
					if (slide.parent_arr.my_type == 'left') self.enableControl('right');
					if (slide.parent_arr.my_type == 'right') self.enableControl('left');
					if (slide.parent_arr.my_type == 'up') self.enableControl('down');
					if (slide.parent_arr.my_type == 'down') self.enableControl('up');
				}
			}
		};
	}
})(jQuery);