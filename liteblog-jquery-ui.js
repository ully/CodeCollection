(function($) {
  if (!$) {
		throw new Error("jQuery is need");
	}
	
	/**
	 * 像上飘动文字提示
	 * @author wangyuchao
	 */
	$.fn.clicker = function(opts) {
		
		//init options
		var defaultOptions = {
					text : "",
					moveSpeed : 1,
					time : 50,
					opacitySpeed : 0.05, 
					topPadding : 0,
					isUp : true
		};
		
		if (typeof opts === "string") {
			var options = defaultOptions;
				options.text = opts;
		} else {
			var options = $.extend(defaultOptions,opts || {});
		}
					
		//create clicker
		var $clicker =  $("#jquery-ui-clicker");
		if ($clicker.size() == 0) {
			$clicker = $("<div id='jquery-ui-clicker'></div>").addClass("liteblog-jquery-ui-clicker");
			$clicker.css("opacity", 1).appendTo(document.body);
		}

		//init position
		var offset = $(this).offset(),
			top = offset.top, left = offset.left;
			topPadding = options.topPadding;
		if (topPadding == 0) {
			topPadding = $clicker.height();
		}
			
		if (options.isUp) {
			$clicker.css("top" , top - topPadding)
		} else {
			$clicker.css("top" , top + topPadding)
		}
		$clicker.css("left" , left + this.width() - $clicker.width() ).text(options.text);
		
		//excute
		var excute =  function() {
			var opacity = $clicker.css("opacity");
			if (opacity <= 0) {
				$clicker.hide().css("opacity", 1);
				return;
			}
			setTimeout(function() {
				$clicker.css("opacity", parseInt(Math.round((opacity - options.opacitySpeed) * 100)) /100);
				if (options.isUp) {
					$clicker.css("top", parseInt($clicker.css("top")) - options.moveSpeed);
				} else {
					$clicker.css("top", parseInt($clicker.css("top")) + options.moveSpeed);
				}
				excute();
			}, options.time);
			
		}
		$clicker.show();
		excute();
		return this;
	};
	

	
	/**
	 * 可以移动出的confirm提示框
	 * @author wangyuchao
	 */
	$.fn.smallConfirm = function(callback, opts) { var defaultOptions = {
				ok : "确认",
				cancal : "取消",
				title : "您确定删除这条记录吗?",
				time : 25,
				speed : 7, 
				width : 145,
				height : 65,
				direct : "down",
				align : "left"
				
		};
		
		var callbackFn;
		
		if (typeof callback === 'function') {
			callbackFn = callback;
		} else {
			opts = callback;
		}
		
		var options = $.extend(defaultOptions, opts || {});
		var $confirm = $("#smallConfirm");


		if ($confirm.size() <= 0) {

				//create
			$confirm = $("<div></div>").attr({id : "smallConfirm"}).addClass("liteblog-jquery-ui-smallConfirm-content").width(options.width);
	
			var $title = $("<span id='small-confirm-title'></span>").text(options.title).addClass("liteblog-jquery-ui-smallConfirm-title")
			var $titleContainer = $("<div></div>").addClass("liteblog-jquery-ui-smallConfirm-titleContainer").append($title);
	
			var $OKButton = $("<div id='confirm-ok-button'></div>").text(options.ok).addClass("liteblog-jquery-ui-smallConfirm-button-ok").addClass("liteblog-jquery-ui-smallConfirm-button");
			var $cancelButton = $("<div id='confirm-cancel-button'></div>").text(options.cancal).addClass("liteblog-jquery-ui-smallConfirm-button-cancel").addClass("liteblog-jquery-ui-smallConfirm-button");
			var $buttonZone = $("<div></div>").addClass("liteblog-jquery-ui-smallConfirm-button-zone").append($OKButton).append($cancelButton)
	
	
			var empty = $("<div></div>").addClass("liteblog-jquery-ui-smallConfirm-empty")
				
			var $confirmContent = $("<div></div>").attr({id : "confirm-content"});
			$confirmContent.appendTo($confirm).append($titleContainer).append(empty).append($buttonZone);
	
			$confirm.isRun = false;
			$(document.body).append($confirm);
			
		
			$buttonZone.width($("#small-confirm-title").width())
			$confirm.hide().css({
				"visibility" : "visible", 
				left : 0});
	
			$("#confirm-ok-button").click(function() {
				$confirm.isRun = true;
				closeConfirm();
				if (callbackFn) {
					callbackFn.call($confirm.get(0).currentElement);
				}
			});
			
			$("#confirm-cancel-button").click(function() {
				$confirm.isRun = true;
				closeConfirm();
			});
			
			
			$confirm.get(0).currentElement = null;
		}

		var closeConfirm = function() {
			
			var height = $confirm.height();
			var top = parseInt($confirm.css("top"));
			if (height <= 0) {
				$confirm.isRun = false;
				$confirm.hide();
				return;
			}
			
			if (height - options.speed  < 0) {
				height =  0;
			} else {
				height = height - options.speed;
			}
			
			$confirm.css({
				top : top + options.speed,
				height : height + "px"
			});
			setTimeout(closeConfirm, options.time);
			
		}

		var showConfirm = function() {
			var height = $confirm.height();
			var top = parseInt($confirm.css("top"));
			if (height >= options.height) {
				$confirm.isRun = false;
				return;
			}
			
			if (height + options.speed  >= options.height) {
				height =  options.height;
			} else {
				height = height + options.speed;
			}
			
			$confirm.css({
				top : top - options.speed,
				height : height + "px"
			});
			
			setTimeout(showConfirm, options.time);
		}


		this.click(function() {
			if ($confirm.isRun == true) {
				return;
			}
			
			var offset = $(this).offset();
			var top = offset.top;
			var left = offset.left;
			
			var isDown = options.direct == "down";
			var align = options.align;
			
			if (isDown) {
				var height = $(this).outerHeight();
				top = top + height + options.height;
			}
			
			if (align == "right") {
				left = left - options.width + $(this).width();
			} else if (align == "center") {
				left = left - (options.width / 2 - $(this).width() / 2);
			}
			
			$confirm.css("top", top + "px").css("left", left + "px").height("0").show();
			$confirm.isRun = true;
			$confirm.get(0).currentElement = this;
			showConfirm();
		});
	}

	
    /**
     * 文字统计
     * @author wangyuchao
     */
	$.fn.countText = function(getShowZoneFn, opts) {
		
		var defaultOptions = {
			maxLength : 150,
			textareaOverflowBorder : true,
			timerSpeed : 0,
			overflowText : "您已经超出",
			normalText : "您还可以输入"
		};
		
		if (typeof getShowZoneFn !== 'function') {
			throw new Error("getShowZoneFn is need");
		}
		
		var options = $.extend(defaultOptions,opts || {});
		
		var notSpecial = /[\u0021-\u007E]/, blank = /^\s$/;
		var $this = this;
		
		var initText = function() {
			$(this).each(function() {
				this.$showZone = getShowZoneFn.call(this);
				var textZone = [];
				textZone.push('<span class="liteblog-jquery-ui-counttext-length-normal">');
				textZone.push(options.normalText);
				textZone.push('<em>');
				textZone.push(options.maxLength);
				textZone.push('</em>字');
				textZone.push('</span>');
				
				textZone.push('<span class="liteblog-jquery-ui-counttext-length-overflow  hidden">');
				textZone.push(options.overflowText);
				textZone.push('<em>0</em>字');
				textZone.push('</span>');
				this.$showZone.html(textZone.join(""));
				this.$numberZone = this.$showZone.find("span").eq(0);
				this.isOverflow = false;
			});
			
		};
		initText.call($this);
		
		var count = function() {
			/* old version
			var word = $(this).val(), c, total = 0, notSpecialCount = 0;
			
			for (var i = 0, ii = word.length; i < ii; i++) {
				c = word[i];
				if (blank.test(c)) {
					continue;
				}
				if (notSpecial.test(c)){
					notSpecialCount++;
				} else {
					total++;
				}
			}
			this.realLength = total + Math.round(notSpecialCount / 2);
			*/
			
			var content = $.trim($(this).val());
			this.realLength = content.length;
		};
		
		var show = function() {
			var length = options.maxLength - this.realLength;
			if (length < 0 && this.isOverflow == false) {
				this.isOverflow = true;
				this.$showZone.find("span").eq(0).addClass("hidden");
				this.$numberZone = this.$showZone.find("span").eq(1).removeClass("hidden");
				if (options.textareaOverflowBorder) {
					$(this).addClass("liteblog-jquery-ui-counttext-textarea-overflow");
				}
			}
			
			if (length >= 0 && this.isOverflow == true) {
				this.isOverflow = false;
				this.$numberZone = this.$showZone.find("span").eq(0).removeClass("hidden");
				this.$showZone.find("span").eq(1).addClass("hidden");
				if (options.textareaOverflowBorder) {
					$(this).removeClass("liteblog-jquery-ui-counttext-textarea-overflow");
				}
			}
			if (this.isOverflow) {
				length = Math.abs(length);
			}
			this.$numberZone.find("em").text(length)
			
			
		}
		
		
		
	// use timer
		if (options.timerSpeed > 0) {
			$this.focus(function() {
				this.isFocus = true, textarea = this;
				var countLoop = function() {
					count.call(textarea);
					show.call(textarea);
					if (textarea.isFocus) {
						setTimeout(function() {
							countLoop();
						}, options.timerSpeed);
					}
				}
				countLoop();
			});
			$this.blur(function() {
				this.isFocus = false;
				count.call(this);
				show.call(this);
			});
			
		} else {
			$this.keyup = function() {
				count.call(this);
				show.call(this);
			}
		}
		
		
	};

	/**
	 * modal dialog
	 * @author fangyuan
	 */

	$.fn.toCenter=function ()
	{
		var $elem=this;
		var w=$elem.width();
		var h=$elem.height();
		
		var t=$(document).scrollTop()+($(window).height()/2)-(h/2);
		if(t<0)
		{
			t=0;
		}
		var l=$(document).scrollLeft()+($(window).width()/2)-(w/2);
		if(l<0){l=0;}
		
		$elem.css({
			'top':t+"px",
			'left':l+"px"
		});
	}
	
	$.lockWindow = function() {
		var top=$(document).scrollTop();
		var left=$(document).scrollLeft();
		
		$(window).data("lockscreen_scrollFunc",function(){
			window.scrollTo(left,top);});
		$(window).bind("scroll",$(window).data("lockscreen_scrollFunc"));
	} 
	$.releaseWindow = function() {
		$(window).unbind("scroll",$(window).data("lockscreen_scrollFunc"));
	}
	
	
	/*
		@Description: Lock the current screen
		@Param
			option: to allow user to define the lock-layer style.
	*/
	$.lockscreen=function()
	{
		var top=$(document).scrollTop();
		var left=$(document).scrollLeft();
		$(window).data("lockscreen_scrollFunc",function(){
			window.scrollTo(left,top);});
		$(window).bind("scroll",$(window).data("lockscreen_scrollFunc"));
		var $elem=$("#liteblog-masklayer");
		if($elem.size()<1)
			{
				$(document.body).append("<div id='liteblog-masklayer'></div>");
				$mask=$("#liteblog-masklayer");
				$mask.css({
					position:"absolute",
					'top': top+"px",
					'left': left+"px",
					'z-index': "900",
					'height': "100%",
					'width': "100%"
				});
			}
			else
			{
				$elem.css({
					'top':top+"px",
					'left':left+"px",
					'display':"block"
				});
				$elem.height();
			}
	}

	$.releasescreen=function()
	{
		$(window).unbind("scroll",$(window).data("lockscreen_scrollFunc"));
		$mask=$("#liteblog-masklayer");
		if($mask.size()>0)
		{
			$mask.css("display","none");
		}
	}
/*
	@Description: open a dialog upon the lock layer
	@Param
		element: to identify a element which to be  content of  the dialog
		isLock: to decide whether the lock layer will display.
*/

	$.fn.showDialog=function(isLock)
	{
		$me=this;
		if(isLock)
		{	
			$.lockscreen();
		}
		$me.css({
			'position':"absolute",
			'z-index':"901"
		});
		$me.toCenter();
	};

	$.fn.closeDialog=function()
	{
		this.remove();
		$.releasescreen();
	}
	
	$.showTips=function(title,content) {
		$.lockscreen();
		
		var elem=document.createElement("div");
		elem.setAttribute("id","liteblog-warndialog");
		var titleElem=document.createElement("p");
		titleElem.setAttribute("id","liteblog-warndialog-title");
		titleElem.innerHTML=title;
		var contentElem=document.createElement("p");
		contentElem.setAttribute("id","liteblog-warndialog-content");
		contentElem.innerHTML=content;
		var  confirmElem=document.createElement("input");
		confirmElem.setAttribute("id","liteblog-warndialog-confirm");
		confirmElem.type="button";
		confirmElem.value="确定";
		confirmElem.onclick=function(){
			var elem=document.getElementById("liteblog-warndialog");
			if(elem)
			{
				$.releasescreen();
				document.body.removeChild(elem);
			}
		}
	
		elem.appendChild(titleElem);
		elem.appendChild(contentElem);
		elem.appendChild(confirmElem);
		var firsNode=document.body.childNodes[0];
		 firsNode.parentNode.insertBefore(elem,firsNode);
		//document.body.appendChild(elem);
	
		elem.style.position="absolute";
		elem.style.zIndex="901";
		elem.style.display="block";
		$(elem).toCenter();
	}
	
	
	
	/**
	 * 
	 */
	$.openDialog = function($dialog, $exitButton, isLock) {
		var isLock = true || isLock;
		if (isLock) {
			$.lockscreen();
			$("#liteblog-masklayer").css({
				"background" : "gray",
				opacity: "0.1",
				filter: "alpha(opacity=10)"
			});
		}
		if ($exitButton) {
			$exitButton.click(function() {
				$dialog.remove();
				$.releasescreen();
			});
		}
		
		$dialog.css({
				"position" : "absolute",
				"zIndex" : "901"
				});
		$dialog.appendTo(document.body).toCenter();
	}
	
	
	
	
	
	
	
	/**
	 * 进度显示条
	 * 	滚动条分成n(初始化设置)个节点
	 * parem options 
	 * options 有个command 参数
	 * 			command 表示调用5种状态下的命令
	 * 				init : 初始化 ,带额外参数total(总共有多少节点)
	 * 				next : 跳转到下个节点
	 * 				finish  ：完成某个节点
	 * 				forward : 在某个节点范围内前进百分之多少, 带额外参数rate(百分比)
	 * 				back : 回到前一个节点
	 * 
	 * 			next与finish 分开的原因是因为 finish代表成功情况才会
	 * 
	 * @author wangyuchao
	 */
	$.fn.progress = function(options) {
		
		if (!options || typeof options.command != "string") {
			throw new Error("options and options.command is must");
		}
		var command = options.command;
		
		
		//根据总节点,当前节点,以及剩余距离(totalDistance % total结果),分配剩余距离
		var getRemainCompensate = function(total, current, remain) {
			if (remain > total) {
				var remainCompensate = parseInt(remain / total);
				if (current == total) {
					return remainCompensate + remian % total;
				}
				return remainCompensate;
			} else if (remain != 0 && remain < total && current <= remain) {
				return 1;
			} 
			
			return 0;
		}
		
		var commands = {
			init : function() {
				var total = options.total;
				this.data("total", total);
				this.data("current",0);
				
				this.empty();
				
				var totalDistance = this.width();
				var moveDistance =  parseInt(totalDistance / total);
				var remainDistance = totalDistance % total;
				this.data("moveDisance", moveDistance);
				this.data("remainDistance", remainDistance);
				
				var $line = $('<div class="liteblog-progress-line"></div>').appendTo(this);
				$line.css({
					width: 0,
					height : this.height()
					});
				this.data("hasMoveDisance", 0);
				return this;
			},
			
			next : function() {
				var total = this.data("total");
				var current = this.data("current");
				var remainDistance = this.data("remainDistance");
				if (total == current) {
					return this;
				}
				this.data("current", ++current);
				return this;
			},
			finish : function() {
				var total = this.data("total");
				var current = this.data("current");
				var remainDistance = this.data("remainDistance");
				var moveDistance = this.data("moveDisance");
				var width = this.data("hasMoveDisance") + moveDistance +  getRemainCompensate(total, current, remainDistance);
				
				this.find(".liteblog-progress-line").width(width);
				this.data("hasMoveDisance", width);
				if (typeof options.callback == "function") {
					options.callback();
				}
				return this;
			},
			back : function() {
				var total = this.data("total");
				var current = this.data("current");
				var remainDistance = this.data("remainDistance");
				var width = this.data("hasMoveDisance");
				this.find(".liteblog-progress-line").width(width);
				return this;
			},
			forward : function() {
				var rate = options.rate;
				var total = this.data("total");
				var current = this.data("current");
				var remainDistance = this.data("remainDistance");
				var moveDistance = this.data("moveDisance") ;
				moveDistance = parseInt(moveDistance * rate);
				var width = this.data("hasMoveDisance") + moveDistance;
				var $line = this.find(".liteblog-progress-line");
				$line.width(width);
				return this;
			}
		}
		
		var command = commands[options.command];
		if (command) {
			command.call(this);
		}
	
	}
	
	
	
	
	
	/**
	 * 右下角滚动提示
	 * @author wangyuchao
	 */
	$.fn.scrollToTop = function(css) {
		var isIE = !!window.ActiveXObject;  
		var isIE6 = isIE && !window.XMLHttpRequest; 
		if (isIE6) {
			return;
		}
		//var isScrolling = true;
		var $returnTopButton = $("#return-top");
		if ($returnTopButton.size() < 1) {
			$returnTopButton = $('<div id="return-top" class="hidden"></div>').appendTo(document.body);
		}
		if (css) {
			$returnTopButton.css(css);
		}
		$returnTopButton.click(function() {
			$(this).addClass("hidden");
			//isScrolling = true;
			$(window).scrollTop(0);
			///isScrolling = false;
		});
		
		$(window).scroll(function() {
			/*
			if (isScrolling) {
				return;
			}
			*/
		
			var height = document.documentElement.clientHeight;
			var scrollTop = $(window).scrollTop();
			if (scrollTop > height) {
				$returnTopButton.removeClass("hidden");
			} else {
				$returnTopButton.addClass("hidden");
			}
		});
	}
	
	
	
	
	
	
	/**
	 * 获取textarea输入框光标坐标
	 * char ${string} 若带有参数,则为光标左边最近字符的坐标
	 * @author wangyuchao
	 */
	$.fn.cursorCoordinate = function(character) {
		if (document.selection) {
			this.get(0).focus();
			var range = document.selection.createRange();
			if (character){
				var lastIndex = this.cursorIndex();
				var firstIndex = this.cursorIndex(character);
				range.moveStart("character", -(lastIndex - firstIndex));
				range.moveEnd("character", -(lastIndex - firstIndex));
			}
			return {
					left : range.boundingLeft + $(window).scrollLeft(),
					top : range.boundingTop  + range.boundingHeight + $(window).scrollTop()
			};
		}
		var $clone = $("#liteblog-cursor-clone");
		if ($clone.size() < 1) {
			$clone = $("<div id='liteblog-cursor-clone'></div>").appendTo(document.body);
		}
			var width = this.width();
			var padding = this.css("padding");
			var border = this.css("border");
			var margin = this.css("margin");
			var lineHeight = this.css("line-height");
			var fontSize = this.css("font-size");
			var height = this.css("height");
			var fontFamily = this.css("font-family");
			$clone.css({
				width : width + "px",
				height : height,
				padding : padding,
				border : border,
				margin : margin,
				"line-height" : lineHeight,
				"font-size" : fontSize,
				"font-family" : fontFamily
			});
		var value = this.val().substring(0, this.cursorIndex(character)).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
		
		$clone.html("<span>" + value + "</span>" + "<span id='liteblog-cursor-clone-focus'>|</span>");
		var position = $("#liteblog-cursor-clone-focus").position();
		var offset = this.offset();
		$clone.remove();
		return {left : position.left + offset.left, top : position.top + offset.top + parseInt(fontSize)};
	}
	
	
	
	
	
	
	/**
	 * 获取当前光标在输入框内容中的位置
	 * char ${string} 若带有参数,则为光标左边最近字符的位置
	 * @author wangyuchao
	 */
	$.fn.cursorIndex = function (character) {
		var index = 0, elem = this.get(0);
		if (document.selection) {// IE Support
			elem.focus();
			var range = document.selection.createRange();
			var cloneRange = range.duplicate();
			cloneRange.moveToElementText(elem);
			var index = -1;
			while (cloneRange.inRange(range)) {
				cloneRange.moveStart('character');
				index++;
			};
			if (character) {
				var leftIndex = index;
				var cloneRange = range.duplicate();
				while(leftIndex > 0) {
					cloneRange.moveStart('character', -1);
					leftIndex--;
					if (cloneRange.text.indexOf(character) != -1) {
						index = leftIndex;
						break;
					}
				}
				
			};
		} else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox support
			index = elem.selectionStart;
			if (character) {
				var leftValue = elem.value.substring(0, index);
				if (leftValue.lastIndexOf(character) != - 1) {
					index = leftValue.lastIndexOf(character);
				}
			}
		}
		return index;
	}
	
	
	
	
	
	/**
	 * 根据指定位置插入到输入框中
	 * index ${int} 插入位置
	 * value ${string} 插入内容 
	 * @author wangyuchao
	 */
	$.fn.textCursorInsert = function(index, value) {
		if (document.selection) {
			this.focus();
			var range = document.selection.createRange();
			var lastIndex = this.cursorIndex();
			range.moveStart("character", -(lastIndex - index));
			range.text = value;
			return this;
		}
		
		var myField = this.get(0);
		if (myField.selectionStart || myField.selectionStart == '0') {
			var startPos = index;
			var endPos = myField.selectionStart;
			myField.value = myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);
			myField.focus();
			myField.selectionStart = startPos + value.length;
			myField.selectionEnd = startPos + value.length;
		}
		return this;
	}
	
	
	
	/**
	 * hover 提示框
	 */
	$.fn.hoverDialog = function(opts) {
		if (!opts || !typeof opts.url == 'function') {
			throw new Error("options is need and options.url is must");
		}
		var defaultOptions = {
				noResult : "查无此人",
				loadingText : "正在查询",
				width : 300,
				height : 155,
				shellWidth : 5,
				closeDelay : 25,
				openDelay : 500
				
		};
		//set common param
		var options = $.extend(defaultOptions,opts || {});
		var width = options.width;
		var height = options.height;
		var shellWidth = options.shellWidth;
		var arrowHeight = 10;
		
	
		
		var DIRECT_UP = 0,
			DIRECT_DOWN = 1;
		
		var TOWARD_RIGHT = 11,
			TOWARD_LEFT = 12;
		
		//only count isUp or isDown
		var getDirect = function(targetWidth, targetHeight) {
			var offset = $(this).offset();
			var screenTop = offset.top - $(window).scrollTop();
			
			//30 is 2*padding + arrow height
			if (screenTop >= ((shellWidth * 2 + arrowHeight) + height)) {
				return DIRECT_UP;
			} else {
				return DIRECT_DOWN
			}
		}
		
		// card toward left or right
		var getToward = function(targetWidth, targetHeight) {
			var screenWidth = document.documentElement.clientWidth;
			var offset = $(this).offset();
			if (offset.left + targetWidth < screenWidth) {
				return TOWARD_RIGHT;
			} else {
				return TOWARD_LEFT;
			}
			
		}
		
	
		
		var removeContainer = function() {
			if (this.isOver == false) {
				var $container = this.$container;
				if ($container) {
					$container.hide();
				}
			}
		}
		
		
		
		var hover = function() {
			var $this = $(this), me = this;
			var url = options.url.call(this);
			var direct = getDirect.call(this, width, height);
			var toward = getToward.call(this, width, height);
			
			//check CSS defalut is that DIRECT is UP and  TOWARD is RIGHT
			var offset = $this.offset();
			var containerCss = {
				position : "absolute",
				"zIndex" : 899,
				top : offset.top - (shellWidth * 2 + arrowHeight) - height + "px",
				left : offset.left + "px"
			};
			
			var shellCss = {
				padding : shellWidth + "px",
				width : width + "px",
				height : height + "px",
				background : "#7B7B7B",
				opacity : 0.5,
				filter : "alpha(opacity=50)",
				position : "absolute",
				left : 0,
				top : 0
			};
			
			var contentCss = {
				position : "absolute",
				top : shellWidth + "px",
				left : shellWidth + "px",
				width : width + "px",
				height : height + "px",
				background : "#FFF",
				overflow : "hidden" 
			}
			
			var shellArrowLeft  = parseInt($this.width() / 2 - 11);
			arrowCss = {
				width : "22px",
				height : arrowHeight + "px",
				position : "absolute",
				left : shellArrowLeft + "px",
				top : height + (shellWidth * 2) - 1 + "px",
				background : "url('/public/images/ui/arrow.png') no-repeat 0 -40px"
			};
			
			//if direct is down update this css
			if (direct == DIRECT_DOWN) {
				containerCss.top = offset.top + $(this).height() + "px";
				shellCss.top = arrowHeight + "px";
				arrowCss.top = "0px";
				arrowCss.background = "url('/public/images/ui/arrow.png') no-repeat 0 0";
				contentCss.top =  shellWidth + arrowHeight + "px";
			}
			
			//if toward is left update this css
			if (toward == TOWARD_LEFT) {
				containerCss.left = offset.left - (width - $(this).width())  + "px";
				shellArrowLeft  = parseInt(width - $this.width() / 2 - 11);
				arrowCss.left = shellArrowLeft + "px";
			}
			
			
			
			//if exist ,show it else create it
			var id = "liteblog-hover-dialog-" + url.replace(/\//g, "-").replace(/\./g, "-").replace(/:/g, "-");
			var $container = $("#" + id);
			if ($container.size() > 0) {
				$container.css(containerCss);
				$container.find(".liteblog-hover-dialog-shell").css(shellCss);
				$container.find(".liteblog-hover-dialog-arrow").css(arrowCss);
				$container.find(".liteblog-hover-dialog-content").css(contentCss);
				this.$container = $container;
				$container.get(0).parent = this;
				$container.show();
				return;
			}
			
			
			//create container
			//20 is $shell's padding  
			//30 is $shell's padding + $arrow's height
			var $container = $("<div></div>");
			$container.attr("id", id);
			$container.width(width + 20);
			$container.height(height + 30);
			$container.css(containerCss);
				
			//create shell	
			$shell = $('<div class="liteblog-hover-dialog-shell"></div>')
			$shell.css(shellCss);
			$shell.addClass("round");
			$shell.appendTo($container);
				
			//create arrow
			var $shellArrow = $('<span class="liteblog-hover-dialog-arrow">&nbsp;</span>');
			$shellArrow.css(arrowCss);
			$shellArrow.appendTo($container)
				
			//create content
			$content = $('<div class="liteblog-hover-dialog-content"></div>');
			$content.css(contentCss);
			$content.addClass("round");
			$content.appendTo($container);
			
			var $loading = $('<div></div>');
			$loading.text(options.loadingText);
			$loading.css({
				width : "100%",
				height : "100%",
				"text-align" : "center",
				"line-height" : height + "px",
				"vertical-align" : "middle"
			});
			$content.append($loading);
			
			$(document.body).append($container);
			
			//bind event
			this.$container = $container;
			$container.get(0).parent = this;
			$container.mouseover(function() {
				this.parent.isOver = true;
				var me = this;
				setTimeout(function() {
					removeContainer.call(me.parent);
				}, options.closeDelay);
			});
			$container.mouseout(function() {
				this.parent.isOver = false;
				var me = this;
				setTimeout(function() {
					removeContainer.call(me.parent);
				}, options.closeDelay);
			});
			
			
			//get data
			$.ajax({
				type: "GET",
				data: {time : new Date().getTime()},
				url: url,
				dataType: "text",
				success: function(html) {
					$content.empty().append(html);
				},
				error : function() {
					var $noResult = $('<div></div>');
					$noResult.text(options.noResult);
					$noResult.css({
						width : "100%",
						height : "100%",
						"text-align" : "center",
						"line-height" : height + "px",
						"vertical-align" : "middle"
					});
					$content.empty().append($noResult);
				}
			});
		}
		
		
		this.live("mouseover", function() {
			var me = this;
			me.isOver = true;
			setTimeout(function() {
				if (me.isOver == true) {
					hover.call(me);
				}
			}, options.openDelay);
		});
		
		this.live("mouseout", function() {
			this.isOver = false;
			var me = this;
			setTimeout(function() {
				removeContainer.call(me);
			}, options.closeDelay);
		});
	}
})(jQuery);
