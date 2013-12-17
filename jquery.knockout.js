/**
 * knockout
 * jQuery plugin by Luc Martin
 * @ID $ID
 * @params
 *
 */
(function($) {
	$.fn.knockout = function(args) {
		var n = 0;
		var widths = {};
		var iterator = 0;
		var iteratorText = 0;
		//consolidate the 'this' for the root object
		var base = this,
			defaults = {
				overlayToSet : '.overlayDiv',
				overlayBackgroundColor : '#FFFFFF',
				knockoutTextIE8 : '#000' || $(knockoutText).parent().parent().css('backgroundColor'),
				knockoutTextIE8Bkg : '#FFF'
			};

		//merge in user supplied args
		$.extend(defaults, args || {});
		//Iterate trough all elements set by the plugin

		return this.each(function() {
			//console.info('width '+$(this).width())
			widths[n] = $(this).width();
			n++;

			setTimeout(function(){
					//console.info(widths);
					var font = $(base).css('fontFamily');

					waitForWebfonts([font] , function(){
						doKnockout(defaults,widths);
					});
				}
				,500
			);
		});
		function waitForWebfonts(fonts, callback) {
		    var loadedFonts = 0;
		    for(var i = 0, l = fonts.length; i < l; ++i) {
		        (function(font) {
		            var node = document.createElement('span');
		            // Characters that vary significantly among different fonts
		            node.innerHTML = 'giItT1WQy@!-/#';
		            // Visible - so we can measure it - but not on the screen
		            node.style.position      = 'absolute';
		            node.style.left          = '-10000px';
		            node.style.top           = '-10000px';
		            // Large font size makes even subtle changes obvious
		            node.style.fontSize      = '300px';
		            // Reset any font properties
		            node.style.fontFamily    = 'sans-serif';
		            node.style.fontVariant   = 'normal';
		            node.style.fontStyle     = 'normal';
		            node.style.fontWeight    = 'normal';
		            node.style.letterSpacing = '0';
		            document.body.appendChild(node);

		            // Remember width with no applied web font
		            var width = node.offsetWidth;

		            node.style.fontFamily = font;

		            var interval;
		            function checkFont() {
		                // Compare current width with original width
		                if(node && node.offsetWidth != width) {
		                    ++loadedFonts;
		                    node.parentNode.removeChild(node);
		                    node = null;
		                }

		                // If all fonts have been loaded
		                if(loadedFonts >= fonts.length) {
		                    if(interval) {
		                        clearInterval(interval);
		                    }
		                    if(loadedFonts == fonts.length) {
		                        callback();
		                        return true;
		                    }
		                }
		            };

		            if(!checkFont()) {
		                interval = setInterval(checkFont, 50);
		            }
		        })(fonts[i]);
		    }
		};
		function doKnockout(args,widths){

			var overlayToSet = args.overlayToSet;
			var overlayBackgroundColor = args.overlayBackgroundColor;
			var knockoutText = base[iteratorText];
			var knockoutTextIE8 = args.knockoutTextIE8;
			var knockoutTextIE8Bkg = args.knockoutTextIE8Bkg;
			var absoluteRectWidth = widths[iterator];

			//console.info('absoluteRectWidth '+absoluteRectWidth);
			//console.info('color '+$(knockoutText).parent().parent().css('backgroundColor'));

			// Detect IE old version and show the text in black gna gna gna!
			if ($.browser.msie  && parseInt($.browser.version, 10) <= 8 || navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
				//alert('IE7 setting knockout to black')
				$(knockoutText).css('display','block').css('opacity',1).css('color',knockoutTextIE8).css('backgroundColor', knockoutTextIE8Bkg);
				++iteratorText;
			    return;
			}

			$(knockoutText).css('display','block').css('opacity',0);

			var paddingLeft = Number($(knockoutText).css('paddingLeft').replace('px',''));
			var paddingRight = Number($(knockoutText).css('paddingRight').replace('px',''));

			if (paddingLeft == 0 || paddingLeft < 15 || !paddingLeft){
				paddingLeft = 15;
			}
			if (paddingRight == 0){
				paddingRight = 15;
			}
			if(navigator.userAgent.indexOf("Chrome") == -1){
				console.info(navigator.userAgent.indexOf("Chrome"))
				paddingLeft = 35;
				paddingRight = 55;
			}

			var absoluteRectWidth = absoluteRectWidth + paddingLeft + paddingRight+20;


			var fontSizeNumber = $(knockoutText).css('fontSize').replace('px','');

			//get fontInformation
			var fontInfo = $(knockoutText).css('fontWeight') + ' ' + $(knockoutText).css('fontSize') + ' ' + $(knockoutText).css('fontFamily');
			console.info(fontInfo);

			var fontPadding = Number($(knockoutText).css('paddingTop').replace('px','')) + Number($(knockoutText).css('paddingBottom').replace('px',''));

			if(fontPadding == 0){
				fontPadding = 30;
			}

			var fontText = $(knockoutText).html();
			var textClass = $(knockoutText).attr('class');
			var rectHeight = Number(fontSizeNumber) + Number(fontPadding);

			//console.info('rectHeight '+rectHeight);
			//console.info('fontPadding '+fontPadding);

			if(!$(overlayToSet).css('height')){

				var overlay = '<canvas class="'+overlayToSet.replace('.','')+iterator+'"></canvas>';
				$(knockoutText).before(overlay);
				overlayToSet = $(overlayToSet+iterator);

				$(overlayToSet).attr('height',rectHeight).attr('width',absoluteRectWidth);
				$(overlayToSet).css('height',rectHeight+'px').css('width',absoluteRectWidth).css('color',overlayBackgroundColor);

			}
			// Get a handle to our canvas
			//alert($(overlayToSet).css('height')+' '+rectHeight)

			var canvas = $(overlayToSet);

			var ctx = canvas[0].getContext("2d");
			var color = $(overlayToSet).css('backgroundColor');
			$(overlayToSet).css('backgroundColor','transparent');

			var canvasColor = $(overlayToSet).css('color') || color;

			var rectWidth = $(overlayToSet).css('width').replace('px','');
			if(!rectWidth){
				rectWidth = absoluteRectWidth;
			}


			// Choose font
			ctx.font = fontInfo;

			// Draw the black rectangle
			ctx.fillStyle = canvasColor;
			ctx.fillRect(0, 0, absoluteRectWidth, rectHeight);

			// Punch out the text!
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillText(fontText, paddingLeft, fontSizeNumber);

			//$(overlayToSet).addClass(textClass);
			$(knockoutText).css('display','none')

			++iterator;

			++iteratorText;
		}
	};
})(jQuery);
