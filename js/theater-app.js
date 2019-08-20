var theater = {

	active:                        0, // Used to determine if the app is open or closed.
	blacken:                       0.96,
	sidePanelWidth:                0,
	sidePanelWidth2:               120,
	animation:                     0, // Open() & Close() animation. 1=on, 0=0ff
	timer:                         '',
	videoList:                     '', // Selected video list
	userWidth:                     window.innerWidth,
	bodyWidth:                     document.body.offsetWidth,
	videoSelectorLargeScreenWidth: 135,
	videoSelectorSmallScreenWidth: 220,
	videoWidth:                    0,
	videoHeight:                   0,
	videoOffset:                   0,
	shaderLeftPosition:            0,
	shader:                        $('#shader')[0],
	video:                         $('#video')[0],
	controller:                    $('#controller')[0],
	settings:                      $('#settings')[0],
	
	open: function( selectedList ){

		this.videoList = selectedList;

		if( typeof $('#'+this.videoList)[0] === "undefined" ){ // Check for valid video list

			if( typeof selectedList === "undefined" || selectedList === "" ){

				var errorMessage = "That is not a valid playlist name.";

			}else{

				var selectedVideoList = selectedList.replace( /_/g, " " );
				var errorMessage      = "The " + selectedVideoList + " video playlist no longer exists.";

			}

			alert( errorMessage );
			return;

		}
		
		// debug
		//if(this.userWidth < 810){alert('Small Screen: Body width is ' + this.userWidth);}else{alert('Big Screen: Body width is ' + this.userWidth);}
		
		this.active                       = 1; // Save app state as "on"
		this.shaderLeftPosition           = ( this.bodyWidth / 2 ) - this.userWidth;
		this.shader.style.position        = 'fixed';
		this.shader.style.width           = '100%';
		this.shader.style.height          = '100%';
		this.shader.style.display         = 'block';
		this.shader.style.backgroundColor = '#010101';
		this.shader.style.color           = '#FFFFFF';
		this.shader.style.zIndex          = '100000';
		this.shader.style.left            = '0px';
		this.shader.style.top             = '0px';

		this.fadeToBlack();

	},
	
	fadeToBlack: function(){ // Fade users screen to black and call initializeApp

		this.shader.style.opacity = this.blacken;
		this.initializeApp();

	},
	
	fadeToClear: function(){

		this.shader.style.opacity = 0.00;
		this.shader.style.display = 'none';

	},
	
	initializeApp: function(){ // Initialize app, call openControls() and call changeVideo()

		this.videoWidth = Math.round( this.userWidth * .55 ); // Calculates video container width based on %55 of viewable area in browser

		if( this.videoWidth < 250 ){ this.videoWidth = 250; } // Ensures video container width and height are within YouTube required specifications

		this.videoHeight              = Math.round( this.videoWidth * .8235 ); // Calculates video container height based on YouTube recommended aspect ratio
		this.videoOffset              = Math.round( this.videoWidth / 2 ); // Centers video based on current browser width
		this.video.style.display      = 'block';
		this.video.style.zIndex       = '100002';
		this.video.style.position     = 'fixed';
		this.video.style.top          = '10px';
		this.video.style.left         = '50%';
		this.videoOffset             += 30; // Compensate for 30px of padding on "video" div
		this.video.style.marginLeft   = "-" + this.videoOffset +'px';
		this.controller.style.display = 'block';
		this.settings.style.display   = 'block';
		this.openControls();

		if( window.addEventListener ){ // Detects window resize and calls autoResize() to adjust viewing area

			window.addEventListener( 'resize', function(){ theater.autoResize(); }, false );

		}

	},
	
	openControls: function(){ // Opens YouTube video selection controls

		this.sidePanelWidth        += 1;
		this.controller.style.width = this.sidePanelWidth + 'px';
		this.settings.style.width   = this.sidePanelWidth + 'px';
		this.timer                  = setTimeout( function(){ this.openControls(); }, 10 );
		
		// Stop openControls() loop when complete side panel width is at full width
		if( this.sidePanelWidth >= 160 || this.animation == 0 ){

			clearTimeout( this.timer );
			this.sidePanelWidth = 160;

			if( this.animation == 0 ){ // No animation open

				this.controller.style.width            = this.sidePanelWidth + 'px';
				this.settings.style.width              = this.sidePanelWidth + 'px';
				$('#'+this.videoList)[0].style.display = "block"; // Show selected video list

			}

			var defaultVideoSelect = $('#'+this.videoList)[0].value;
			defaultVideoSelect     = defaultVideoSelect.replace( / /g, '' );
			this.changeVideo( defaultVideoSelect );
			
			// Scroll to the top of the window
			window.scrollTo( 0, 0 );
			
		}
		
	},
	
	changeVideo: function( ID ){

		var videoSelect = $('#'+this.videoList)[0].value;
		videoSelect     = videoSelect.replace( / /g, '' );
		var html5       = "?html5=1";

		if( ID != "void" && videoSelect != '' && videoSelect.length == 11 ){

			var videoCode1       = '<iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube" src="https://www.youtube.com/embed/';
			var videoCode2       =  '" frameborder="0" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoSelect + html5 + videoCode2;

			// Custom Google Analytics tracking code
			/*var pageValue = '/YouTubeTheaterApp/Playlist=' + this.videoList + '&CurrentVideo=' + videoSelect;

			ga('send', {
			  hitType: 'pageview',
			  page: pageValue
			});*/

		}else if( videoSelect.length != 11 && videoSelect != '' ){

			var videoCode1       = 'Video ID is invalid.<br/><iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube"';
			var videoCode2       = 'frameborder="0" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoCode2;

		}else{

			var videoCode1       = 'Video is not available.<br/><iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube"';
			var videoCode2       = 'frameborder="0" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoCode2;

		}

		this.autoResize(); // Forces layout resize on initialization and video changes.

	},
	
	closeControls: function(){

		this.sidePanelWidth        -= 1;
		this.controller.style.width = this.sidePanelWidth + 'px';
		this.settings.style.width   = this.sidePanelWidth + 'px';
		this.timer                  = setTimeout( function(){ this.closeControls(); }, 1 );

		if( this.sidePanelWidth <= 0 || this.animation == 0 ){ // Stop 'close' loop when complete

			clearTimeout( this.timer );
			this.sidePanelWidth = 0;

			if( this.animation == 0 ){ // No animation close

				this.controller.style.width            = this.sidePanelWidth + 'px';
				this.settings.style.width              = this.sidePanelWidth + 'px';
				$('#'+this.videoList)[0].style.display = "none"; // Hide selected video list

			}

			this.controller.style.display = 'none';
			this.settings.style.display   = 'none';
			this.fadeToClear();

		} // "Close" loop ended

	},
	
	autoResize: function(){ // Called when viewer resizes browser window

		// Check if app is active.
		if( this.active == 1 ){

			this.userWidth = window.innerWidth;
			
			// Check device view size
			if( this.userWidth > 810 ){

				// Larger screens
				
				// Calculates video container width based on 55% of viewable area in browser.
				this.videoWidth             = Math.round( this.userWidth * .55 );
				this.settings.style.display = "block";
				
				// Remove small screen modifier classes
				this.controller.className = "";
				this.video.className      = "";
				
				$('#'+this.videoList)[0].style.width = this.videoSelectorLargeScreenWidth + "px";

			}else{

				// Smaller screens
				
				// Calculates video container width based on 75% of viewable area in browser.
				this.videoWidth = Math.round( this.userWidth * .75 );
				
				// Hide settings panel
				this.settings.style.display = "none";
				
				// Add small screen modifier classes
				this.controller.className = "controllerSmallScreen";
				this.video.className      = "videoSmallScreen";
				
				$('#'+this.videoList)[0].style.width = this.videoSelectorSmallScreenWidth + "px";

			}

			if( this.videoWidth < 250 ){ this.videoWidth = 250; } // Ensures video width and height are within YouTube required specifications

			this.videoHeight            = Math.round( this.videoWidth * .8235 ); // Calculates video height based on YouTube recommended aspect ratio
			var youTubeVideo            = $('#YouTube')[0];
			this.video.style.width      = this.videoWidth + 'px';
			this.video.style.height     = this.videoHeight + 'px';
			youTubeVideo.style.width    = this.videoWidth + 'px';
			youTubeVideo.style.height   = this.videoHeight + 'px';
			this.videoOffset            = Math.round( this.videoWidth / 2 ); // Calculate videoContainer center position
			this.videoOffset           += ( ( this.video.offsetWidth - youTubeVideo.offsetWidth ) / 2 ); // Compensate for 30px of padding on "video" div
			this.video.style.marginLeft = '-'+ this.videoOffset +'px'; // Apply new center location to the video container DIV

		}

	},
	
	close: function(){

		this.closeControls();
		var video           = $('#video')[0];
		video.style.display = 'none';

		// Remove currently loaded/loading YouTube video to prevent background bandwidth usage
		video.innerHTML = "<div id=\"YouTube\" style=\"display:none;\"></div>";
		this.active     = 0;

	}

}