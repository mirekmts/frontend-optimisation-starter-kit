define(['components/domReady', 'components/flexbox_fallback', 'components/placeholders.min', 'components/magnific'], function(domReady, fallback, $twitter, $placeholders, $magnificPopup) {

	var global = {

		megamenu: function() {
			$('.navbar-menu .navbar-menu__dropdown a').on('click', function() {

				var megamenu_layer_id = $(this).attr('id');
				$('.l-megamenu__layer').css({'display':'none'});
				$('#megamenu-'+megamenu_layer_id).fadeIn();
				$('.overlay').fadeIn();


				if(!($(this).hasClass('active')))
				{
					$('.navbar-menu .navbar-menu__dropdown a.active').removeClass('active');
					$(this).addClass('active');



					if(!($('.l-megamenu').hasClass('active')))
					{
						$('.l-megamenu').slideToggle().addClass('active');
					}
				}
				else {
					$(this).removeClass('active');
					$('.l-megamenu').removeClass('active').slideToggle();
					$('.overlay').fadeOut();
				}


				return false;
			});


			function close_megamenu() {
				$('.navbar-menu .navbar-menu__dropdown a.active').removeClass('active');
				$('.l-megamenu').removeClass('active').slideToggle();
			}


			$('.overlay').on('click', function() {
				close_megamenu();
				$(this).fadeOut();
			});


			$('.js-close-megamenu').on('click', function() {
				$('.overlay').fadeOut();
				close_megamenu();

				return false;
			});



			// if anchor links
			$('.l-megamenu__links a[href*="#"]').on('click', function() {
				var url = $(this).attr('href').split('#');


				if(url[0] == window.location.pathname)
				{
					$('.overlay').fadeOut();
					close_megamenu();

					setTimeout(function() {
						global.scrollToID('#'+url[1]);
					}, 400);

					return false;
				}

			});

			var currentPageIsContact = function(){
				var currentURI = window.location.pathname;

				if(currentURI.indexOf('/contact/') > -1) {
					return true;
				}
				else {
					return false;
				}
			}

			// if contact item clicked
			$('.js-contactItem').on('click', function() {

				if(currentPageIsContact()) {
					global.scrollToID('#form');
					return false;
				}
			});


			// close mega menu via clicking ESC
			$(document).keyup(function(e) {
			  	if (e.keyCode == 27 && $('.navbar-menu .navbar-menu__dropdown a.active').length) {
			  		close_megamenu();
			  		$('.overlay').fadeOut();
			  	}
			});
		},


		magnific: function()
		{
		        $('a.popup, .js-popup').on('click', function() {
		        	var href = $(this).attr('href');
		        	var type = href.substring(href.length-4, href.length);
		        	var title = $(this).attr('title');
					var clickedLinkClassName = $(this).attr('class');
					var isInlinePopup = $(this).attr('data-inline-popup') || false;

		        	if (type == '.jpg' || type == '.gif' || type == '.png' || type == 'jpeg')
		        	{
		        		type = 'image';
					}
					else if (isInlinePopup) {
						type = 'inline';
					}
		        	else {
		        		type = 'iframe';
		        	}

					$.magnificPopup.open({
					  items: {
					    src: href
					  },
					  type: type,
					  titleSrc: title,
				      gallery: {
				        enabled: true,
				        navigateByImgClick: true
				      },
					  callbacks: {
					    close: function() {

					      if(clickedLinkClassName.indexOf('js-scrollToContent') > -1) {

							var targetOffset = $('.main').offset().top;

							setTimeout(function() {
								$('html,body').animate({scrollTop:targetOffset}, 600);
							}, 300);
					      }
					    }
					  }
					});

					return false;
		        });
		},

		searchbar: function() {

			function close_searchbar() {
				$('.search .layout3').fadeOut(0);
				$('.search').fadeOut(0);
				$('html').removeClass('no-scrollbar');
			}


			$('.js-open-searchbar').on('click', function() {
				$('.search').fadeIn(0);
				$('.search .layout3').fadeIn();
				$('html').addClass('no-scrollbar');
				$('.search input').focus();

				return false;
			});


			$('.search .btn-close').on('click', function() {
				close_searchbar();
			});


			$(document).keyup(function(e) {
			  	if (e.keyCode == 27) {
			  		close_searchbar();
			  	}
			});
		},


		burger_menu: function() {
			$('.l-navbar__burger').on('click', function() {
				$('.navbar-menu').toggleClass('active');

			});
		},

		fallbacks: function() {
			var ua = navigator.userAgent.toLowerCase();
			var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
			var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

			if(isAndroid || isSafari) {
			  	$('.page-section--global-map, .page-section--network').addClass('page-section--no-fixed-bg');
			  	$('.resources-list__group, .info-box, .info-box__blue > div').addClass('fallback_no-flexbox');
			}
		},





		sticky_submenu: function() {
				//variables
				var $window = $(window);
				var $container = $(".inner-page__submenu--sticky");
				var $main = $(".inner-page__container");
				var window_min = 0;
				var window_max = 0;
				var threshold_offset = 50;
				/*
				 set the container's maximum and minimum limits as well as movement thresholds
				*/
				function set_limits(){
					//max and min container movements
					var max_move = $main.offset().top + $main.height() - $container.height() - 2*parseInt($container.css("top") );
					var min_move = $main.offset().top;
					//save them
					$container.attr("data-min", min_move).attr("data-max",max_move);
					//window thresholds so the movement isn't called when its not needed!
					//you may wish to adjust the freshhold offset
					window_min = min_move - threshold_offset;
					window_max = max_move + $container.height() + threshold_offset;
				}
				//sets the limits for the first load
				set_limits();

				function window_scroll(){
					//if the window is within the threshold, begin movements
					if( $window.scrollTop() >= window_min && $window.scrollTop() < window_max ){
						//reset the limits (optional)
						set_limits();
						//move the container
						container_move();
					}
				}
				$window.bind("scroll", window_scroll);

				/**
				 * Handles moving the container if needed.
				**/
				function container_move(){
					var wst = $window.scrollTop();
					//if the window scroll is within the min and max (the container will be "sticky";
					if( wst >= $container.attr("data-min") && wst <= $container.attr("data-max") ){
						//work out the margin offset
						var margin_top = $window.scrollTop() - $container.attr("data-min");
						//margin it down!
						$container.css("margin-top", margin_top);
					//if the window scroll is below the minimum
					}else if( wst <= $container.attr("data-min") ){
						//fix the container to the top.
						$container.css("margin-top",0);
					//if the window scroll is above the maximum
					}else if( wst > $container.attr("data-max") ){
						//fix the container to the top
						$container.css("margin-top", $container.attr("data-max")-$container.attr("data-min")+"px" );
					}
				}
				//do one container move on load
				container_move();
		},



		scrollToID: function(id)
		{
			var path = window.location.pathname;

			if(path.indexOf('/resources/') == -1)
			{
				var offSet = 65;
				var targetOffset = $(id).offset().top - offSet;
				$('html,body').animate({scrollTop:targetOffset}, 500);
			}
		},



		hash_urls: function() {

			domReady(function()
			{
				if(window.location.hash)
				{
					setTimeout(function() {
						var hash = window.location.hash;
						global.scrollToID(hash);
					}, 500);
				}
			})

		},



		marketo_popup: function() {
			$('.marketo-popup').magnificPopup({
				type: 'ajax',
				overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
			});
		},



		social_media_share: function() {
			var deviceAgent = navigator.userAgent.toLowerCase();

			var isTouchDevice =
			(deviceAgent.match(/(iphone|ipod|ipad)/) ||
			deviceAgent.match(/(android)/)  ||
			deviceAgent.match(/(iemobile)/) ||
			deviceAgent.match(/iphone/i) ||
			deviceAgent.match(/ipad/i) ||
			deviceAgent.match(/ipod/i) ||
			deviceAgent.match(/blackberry/i) ||
			deviceAgent.match(/bada/i));

			if (isTouchDevice) {
				$('.social-media--share ul').css({'top':'-70px'});
			}

		},

		animations: function() {
			var animationInstances = document.querySelectorAll('.animation');

			if (animationInstances.length === 0) {
				return;
			}

			[].forEach.call(animationInstances, function(animation) {
				var animationUrl = animation.dataset.animationFile;

				var animItem = bodymovin.loadAnimation({
					wrapper: animation,
					animType: 'svg',
					loop: true,
					path: animationUrl
				});
			});
		},

		ctaAds: function() {
			var ad = document.getElementById('js-cta-ad');

			if (!ad) {
				return;
			}

			$.ajax({
				url: '/cta-ad.html',
				type: 'GET'
			})
			.then(function(response) {
				ad.innerHTML = response;
			});
		},

	};


  	return {
      	init: function() {
          console.log('global')

      		global.megamenu();
      		global.searchbar();
      		global.magnific();
      		global.burger_menu();
      		global.fallbacks();
      		global.marketo_popup();
      		global.social_media_share();
			// global.paymentForms();
			global.animations();
			global.ctaAds();

      		if ($(".inner-page__submenu--sticky").length)
      		{
      			global.sticky_submenu();
      		}

      		global.hash_urls();


          	$('a[rel="external"]').attr('target', '_blank');
          	$('.page-col__contact-btn .btn').on('click', function() {
          		global.scrollToID('#map');
          		return false;
          	});


          	/* buttons span */
          	$('.btn').wrapInner('<span />');
      	}
  	};

});
