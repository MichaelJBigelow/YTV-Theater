const theater = {

	revision:       "3.27.2020.1",
	active:         false, // Used to determine if the app is open or closed
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
		this.video          = document.querySelector( "#pe-theater-youtube-video" );
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
				errorMessage          = `The ${selectedVideoList} playlist could not be found.`;

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
			/*let pageValue = '/pe-theater-app/playlist=' + this.videoList + '&currentVideo=' + videoId;

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

			let viewHeight       = this.shader.clientHeight;
			let viewWidth        = this.shader.clientWidth;
			let availableHeight  = Math.round( viewHeight * 0.95 ); // Window height minus scrollbar
			let availableWidth   = Math.round( viewWidth * 0.95 ); // Window width minus scrollbar
			let videoHeight      = 0;
			let videoWidth       = 0;
			let aspectRatio      = 0.5625; // YouTube recommended aspect ratio of 16:9

			if( availableHeight > availableWidth ){ // Portrait

				videoWidth  = Math.round( availableWidth ); // Calculate width first
				videoHeight = Math.round( availableWidth * aspectRatio ); // Apply 16:9 ratio

			}else{ // Landscape

				let viewAspectRatio = availableHeight / availableWidth;

				if( viewAspectRatio > aspectRatio ){

					videoWidth  = Math.round( availableWidth ); // Calculate width first
					videoHeight = Math.round( availableWidth * aspectRatio ); // Apply 16:9 ratio

				}else{

					videoHeight = Math.round( availableHeight );
					videoWidth  = Math.round( videoHeight / aspectRatio );

				}

			}

			// Set video container size
			this.videoContainer.style.height = `${videoHeight}px`;
			this.videoContainer.style.width  = `${videoWidth}px`;

			// Set video container position
			let videoLeftMargin                  = videoWidth / 2;
			let videoTopPos                      = ( viewHeight - videoHeight ) / 2;
			this.videoContainer.style.marginLeft = `-${videoLeftMargin}px`;
			this.videoContainer.style.top        = `${videoTopPos}px`;

			// Set controller position
			let controllerLeftMargin = this.controller.offsetWidth / 2;
			this.controller.style.marginLeft = `-${controllerLeftMargin}px`;

		}

	}

}