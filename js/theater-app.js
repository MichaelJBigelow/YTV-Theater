const theater = {

	revision:       "3.25.2020.1",
	active:         false, // Used to determine if the app is open or closed.
	videoList:      "", // Selected video list
	videoWidth:     0,
	videoHeight:    0,
	videoOffset:    0,
	shader:         null,
	videoContainer: null,
	video:          null,
	controller:     null,

	initialize(){

		this.shader         = document.querySelector( "#pe-theater-shader" );
		this.videoContainer = document.querySelector( "#pe-theater-video-container" );
		this.video          = document.querySelector( "#youtube-video" );
		this.controller     = document.querySelector( "#pe-theater-controller" );

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

		this.active                       = true;
		this.shader.style.display         = "block";
		this.videoContainer.style.display = "block";
		this.controller.style.display     = "block";

		this.openControls();

		let defaultVideoSelect = document.querySelector( "#" + this.videoList ).value;
		defaultVideoSelect     = defaultVideoSelect.replace( / /g, "" );
		this.loadVideo( defaultVideoSelect );

	},

	close(){

		this.closeControls();

		this.videoContainer.style.display = "none";
		this.shader.style.display         = "none";
		this.controller.style.display     = "none";
		this.active                       = false;

	},

	loadVideo( videoId ){

		if( videoId != "" && videoId.length == 11 ){

			this.video.src = `https://www.youtube.com/embed/${videoId}`;

			// Custom Google Analytics tracking code
			/*let pageValue = '/YouTubeTheaterApp/Playlist=' + this.videoList + '&CurrentVideo=' + videoId;

			ga('send', {
			  hitType: 'pageview',
			  page: pageValue
			});*/

		}else{

			this.video.src = ""; // Unload previous video
			alert( 'Invalid video ID.' );

		}

		this.setSize(); // Forces layout resize on initialization and video changes.

	},

	openControls(){ // Opens YouTube video selection controls

		// Show selected video list
		document.querySelector( "#" + this.videoList ).style.display = "block";

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

			this.videoHeight                     = Math.round( this.videoWidth * .8235 ); // Calculates video height based on YouTube recommended aspect ratio
			this.videoContainer.style.width      = this.videoWidth + "px";
			this.videoContainer.style.height     = this.videoHeight + "px";
			this.videoOffset                     = Math.round( this.videoWidth / 2 ); // Calculate videoContainer center position
			this.videoOffset                     += ( ( this.video.offsetWidth - this.video.offsetWidth ) / 2 ); // Compensate for padding on "video" div
			this.videoContainer.style.marginLeft = "-" + this.videoOffset + "px"; // Apply new center location to the video container DIV

		}

	}

}