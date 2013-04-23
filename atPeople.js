(function($) {
  $.fn.atPeople = function() {

		this.autocomplete({
			source: function( request, response ) {
				var $currentElement = this.element;
				var index = $currentElement.cursorIndex();
				var word = $currentElement.val();
				var leftWord = word.substring(0, index);
				if (leftWord.indexOf("@") == -1 || leftWord[leftWord.length - 1] == " " || leftWord.lastIndexOf("@") < leftWord.lastIndexOf(" ")) {
					this.close();
					return;
				}

				word = leftWord.substring(leftWord.lastIndexOf("@") + 1, leftWord.length);
				var newWord = "";
				for (var i = 0, ii = word.length; i < ii; i++) {
					if (word.charAt(i) == "@" || word.charAt(i) == " ") {
						break;
					}
					newWord = newWord + word.charAt(i);
				}
				if (!newWord) {
					this.close();
					return;
				}

				window.liteblog = window.liteblog || {};
				window.liteblog.autoCompletecache = window.liteblog.autoCompletecache || {};

				if (window.liteblog.autoCompletecache[newWord]) {
					var result = window.liteblog.autoCompletecache[newWord];
					$currentElement.get(0).currentIndex = leftWord.lastIndexOf("@") + 1;
					response(result);
					return;
				}

				$.ajax({
					url: "/autoCompleteTipData",
					dataType: "json",
					data: {
						keyword: newWord
					},
					success: function( data ) {
						var result = [];
						$.each(data, function(index, item) {
							var displayName=item.displayName;
							var label = displayName;
							if(displayName.indexOf(word)==0){
								label = "<b>" + word + "</b>" + displayName.substring(word.length);
							}
							result.push({
								label: label,
								value: displayName,
								department:item.department,
								name:item.name,
								type:item.type
							});
						})
						$currentElement.get(0).currentIndex = leftWord.lastIndexOf("@") + 1;
						window.liteblog.autoCompletecache[newWord] = result;
						response(result);
					}
				});
			},
			minLength: 1,
			select: function( event, ui ) {
				var index = this.currentIndex;
				$(this).textCursorInsert(index, ui.item.name + " ");
				return false;
			},
			focus: function(event,ui){
				//$(this).val(ui.item.value+" ("+ui.item.department+")");
				return false;
			}
		})
            .die('input.autocomplete')
            .live("input.autocomplete", function( event ) {
			var self = $.data(this, "autocomplete");
			clearTimeout( self.searching );
			self.searching = setTimeout(function() {
			   // only search if the value has changed
			   if ( self.term != self.element.val() ) {
				   self.selectedItem = null;
				   self.search( null, event );
			   }
			}, self.options.delay );
		}).data("autocomplete")._renderItem = function( ul, item) {
				$elem=null;
				if(item.type==1){
					$elem=$( "<li style='margin:6px'></li>" ).data( "item.autocomplete", item )
					 .append("<div style='display:inline;'><img  style='height:17px;width:17px;vertical-align:middle;'  src='/public/images/suggestion/user.png'/> <span style='color:#9CAAB2;font-weight:bold;height:30px;vertical-align:middle;font-size:14px'>用户</span><div>");
				}
				else if(item.type==2){
					$elem=$( "<li></li>" ).data( "item.autocomplete", item );
					if(item.department==null){
						$elem.append( "<a><font color='#087FB5'>"+item.value+"</font></a>" );
					}
					else{
						$elem.append( "<a><font color='#087FB5'>"+item.value+"</font>  <font color='#A5A5A5'>("+item.department+ ")</font></a>" );
					}
				}
				return $elem.appendTo( ul );
		};

		this.data("autocomplete")._suggest = function( items ) {
			var ul = this.menu.element
				.empty()
				.zIndex( this.element.zIndex() + 1 );
			this._renderMenu( ul, items );
			// TODO refresh should check if the active item is still in the dom, removing the need for a manual deactivate
			this.menu.deactivate();
			this.menu.refresh();

			// size and position menu

//			var $elem=$( "<li style='margin:6px'></li>" ).append("<div style='display:inline;'><img  style='height:17px;width:17px;vertical-align:middle;'  src='/public/images/suggestion/user.png'/> <span style='color:#9CAAB2;font-weight:bold;height:30px;vertical-align:middle;font-size:14px'>用户</span><div>");
//			ul.prepend($elem);


			ul.show();
			this._resizeMenu();
			ul.position( $.extend({
				of: this.element
			}, this.options.position ));

			var event = {};
			this._move("next", event);

		}

		this.data("autocomplete")._response = function( content ) {
			var $currentElement = this.element;
			if ( !this.options.disabled && content && content.length ) {
				content = this._normalize( content );
				this._suggest( content );


				var coordinate = $currentElement.cursorCoordinate("@");
				this._trigger( "open" );
				$(".ui-autocomplete").css({
					top : coordinate.top + 4 + "px",
					left : coordinate.left + "px",
					width : "244px"
				});
			} else {
				this.close();
			}
			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		};
		this.keyup(function(event) {
			var keyCode = event.keyCode;
			if (keyCode == 37 || keyCode == 39) {
				$(this).data("autocomplete").source(null, $(this).data("autocomplete").response);
			}
		});


	}
})(jQuery);
