var theater = {

	revision:                      "11.12.2019.1",
	url:                           window.location.href,
	urlOrigin:                     window.location.origin,
	queryString:                   window.location.search,
	active:                        false, // Used to determine if the app is open or closed.
	videoList:                     "", // Selected video list
	userWidth:                     window.innerWidth,
	videoWidth:                    0,
	videoHeight:                   0,
	videoOffset:                   0,
	shader:                        $("#TheaterShader")[0],
	video:                         $("#TheaterVideo")[0],
	controller:                    $("#TheaterController")[0],
	
	initialize: function(){ // Initialize app

		this.setSize();

		if( window.addEventListener ){ // Detects window resize and calls autoResize() to adjust viewing area

			window.addEventListener( "resize", function(){ theater.setSize(); }, false );

		}

	},
	
	open: function( selectedList ){

		this.videoList = selectedList;

		if( typeof $("#" + this.videoList)[0] === "undefined" ){ // Check for valid video list

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
		
		this.active                       = true;
		this.shader.style.display         = "block";
		this.video.style.display          = "block";
		this.controller.style.display     = "block";

		this.openControls();

		var defaultVideoSelect = $("#" + this.videoList)[0].value;
		defaultVideoSelect     = defaultVideoSelect.replace( / /g, "" );
		this.loadVideo( defaultVideoSelect );

	},

	close: function(){

		this.closeControls();
		var video                     = $("#TheaterVideo")[0];
		video.style.display           = "none";
		video.innerHTML               = '<div id="YouTube" style="display:none;"></div>'; // Remove current YouTube video to prevent background bandwidth usage
		this.shader.style.display     = "none";
		this.controller.style.display = "none";
		this.active                   = false;

	},
	
	loadVideo: function( videoId ){

		if( videoId != "" && videoId.length == 11 ){

			var videoCode1       = '<iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube" src="https://www.youtube.com/embed/';
			var videoCode2       = '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoId + videoCode2;

			// Custom Google Analytics tracking code
			/*var pageValue = '/YouTubeTheaterApp/Playlist=' + this.videoList + '&CurrentVideo=' + videoId;

			ga('send', {
			  hitType: 'pageview',
			  page: pageValue
			});*/

		}else if( videoId.length != 11 && videoId != "" ){

			var videoCode1       = 'Video ID is invalid.<br/><iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube"';
			var videoCode2       = ' frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoCode2;

		}else{

			var videoCode1       = 'Video is not available.<br/><iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="YouTube"';
			var videoCode2       = ' frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoCode2;

		}

		this.setSize(); // Forces layout resize on initialization and video changes.

	},

	openControls: function(){ // Opens YouTube video selection controls

		// Show selected video list
		$("#" + this.videoList)[0].style.display = "block";

		// Scroll to the top of the window
		window.scrollTo( 0, 0 );
		
	},
	
	closeControls: function(){

		// Hide selected video list
		$("#" + this.videoList)[0].style.display = "none";

	},
	
	setSize: function(){ // Called when viewer resizes browser window

		// Check if app is open
		if( this.active ){

			this.userWidth = window.innerWidth;

			// Calculates video container width based on 75% of viewable area in browser
			this.videoWidth = Math.round( this.userWidth * .75 );

			if( this.videoWidth < 250 ){ this.videoWidth = 250; } // Ensures video width and height are within YouTube required specifications

			this.videoHeight            = Math.round( this.videoWidth * .8235 ); // Calculates video height based on YouTube recommended aspect ratio
			var youTubeVideo            = $("#YouTube")[0];
			this.video.style.width      = this.videoWidth + "px";
			this.video.style.height     = this.videoHeight + "px";
			youTubeVideo.style.width    = this.videoWidth + "px";
			youTubeVideo.style.height   = this.videoHeight + "px";
			this.videoOffset            = Math.round( this.videoWidth / 2 ); // Calculate videoContainer center position
			this.videoOffset           += ( ( this.video.offsetWidth - youTubeVideo.offsetWidth ) / 2 ); // Compensate for padding on "video" div
			this.video.style.marginLeft = "-" + this.videoOffset + "px"; // Apply new center location to the video container DIV

		}

	}

}