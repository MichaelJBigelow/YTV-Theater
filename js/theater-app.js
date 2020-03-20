const theater = {

	revision:    "3.20.2020.1",
	active:      false, // Used to determine if the app is open or closed.
	videoList:   "", // Selected video list
	videoWidth:  0,
	videoHeight: 0,
	videoOffset: 0,
	shader:      null,
	video:       null,
	controller:  null,

	initialize(){

		this.shader     = document.querySelector( "#pe-theater-shader" );
		this.video      = document.querySelector( "#pe-theater-video" );
		this.controller = document.querySelector( "#pe-theater-controller" );

		if( window.addEventListener ){ // Detects window resize and calls autoResize() to adjust viewing area

			window.addEventListener( "resize", () => { theater.setSize(); }, false );

		}

	},

	open( selectedList ){

		this.videoList = selectedList;

		if( document.querySelector( "#" + this.videoList ) === null ){ // Check for valid video list

			let errorMessage = '';

			if( typeof selectedList === "undefined" || selectedList === "" ){

				errorMessage = "That is not a valid playlist name.";

			}else{

				let selectedVideoList = selectedList.replace( /_/g, " " );
				errorMessage          = "The " + selectedVideoList + " playlist could not be found.";

			}

			alert( errorMessage );
			return;

		}

		this.active                   = true;
		this.shader.style.display     = "block";
		this.video.style.display      = "block";
		this.controller.style.display = "block";

		this.openControls();

		let defaultVideoSelect = document.querySelector( "#" + this.videoList ).value;
		defaultVideoSelect     = defaultVideoSelect.replace( / /g, "" );
		this.loadVideo( defaultVideoSelect );

	},

	close(){

		this.closeControls();
		let video                     = document.querySelector( "#pe-theater-video" );
		video.style.display           = "none";
		video.innerHTML               = ""; // Remove current YouTube video to prevent background bandwidth usage
		this.shader.style.display     = "none";
		this.controller.style.display = "none";
		this.active                   = false;

	},

	loadVideo( videoId ){

		if( videoId != "" && videoId.length == 11 ){

			let videoCode1       = '<iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="youtube" src="https://www.youtube.com/embed/';
			let videoCode2       = '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoId + videoCode2;

			// Custom Google Analytics tracking code
			/*let pageValue = '/YouTubeTheaterApp/Playlist=' + this.videoList + '&CurrentVideo=' + videoId;

			ga('send', {
			  hitType: 'pageview',
			  page: pageValue
			});*/

		}else{

			let videoCode1       = 'Invalid video ID.<br/><iframe width="' + this.videoWidth + '" height="' + this.videoHeight + '" id="youtube"';
			let videoCode2       = ' frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
			this.video.innerHTML = videoCode1 + videoCode2;

		}

		this.setSize(); // Forces layout resize on initialization and video changes.

	},

	openControls(){ // Opens YouTube video selection controls

		// Show selected video list
		document.querySelector( "#" + this.videoList ).style.display = "block";

		// Scroll to the top of the window
		window.scrollTo( 0, 0 );

	},

	closeControls(){

		// Hide selected video list
		document.querySelector( "#" + this.videoList ).style.display = "none";

	},

	setSize(){ // Called when viewer resizes browser window

		// Check if app is open
		if( this.active ){

			let userWidth = window.innerWidth;

			// Calculates video container width based on 75% of viewable area in browser
			this.videoWidth = Math.round( userWidth * .75 );

			if( this.videoWidth < 250 ){ this.videoWidth = 250; } // Ensures video width and height are within YouTube required specifications

			this.videoHeight            = Math.round( this.videoWidth * .8235 ); // Calculates video height based on YouTube recommended aspect ratio
			let youTubeVideo            = document.querySelector( "#youtube" );
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