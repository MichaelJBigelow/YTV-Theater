const theater = {

	revision:         "3.29.2020.1",
	active:           false, // Used to determine if the theater is open or closed
	controlMaximized: true,
	videoWidth:       0,
	videoHeight:      0,
	videoOffset:      0,
	playlistTitle:    "", // Selected playlist title
	shader:           null,
	playlist:         null,
	videoContainer:   null,
	video:            null,
	controller:       null,
	controllerButton: null,

	initialize(){

		this.shader           = document.querySelector( "#pe-theater-shader" );
		this.videoContainer   = document.querySelector( "#pe-theater-video-container" );
		this.video            = document.querySelector( "#pe-theater-youtube-video" );
		this.controller       = document.querySelector( "#pe-theater-controller" );
		this.controllerButton = document.querySelector( "#pe-theater-controller-button" );

		if( window.addEventListener ){ // Detects window resize and calls autoResize() to adjust viewing area

			window.addEventListener( "resize", () => { theater.setSize(); }, false );

		}

	},

	open( selectedList ){

		this.playlistTitle    = selectedList;
		this.playlist         = document.querySelector( "#" + this.playlistTitle );

		if( this.playlist === null ){ // Check for valid video list

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

		this.active                         = true;
		this.shader.style.display           = "block";
		this.videoContainer.style.display   = "block";
		this.controller.style.display       = "block";
		this.controllerButton.style.display = "block";
		this.playlist.style.display         = "block"; // Show selected video list
		this.maximizeControls();

		let defaultVideoSelect = this.playlist.value;
		defaultVideoSelect     = defaultVideoSelect.replace( / /g, "" );
		this.loadVideo( defaultVideoSelect );

	},

	close(){

		this.videoContainer.style.display   = "none";
		this.shader.style.display           = "none";
		this.controller.style.display       = "none";
		this.controllerButton.style.display = "none";
		this.playlist.style.display         = "none"; // Hide selected video list
		this.active                         = false;

	},

	loadVideo( videoId ){

		if( videoId != "" && videoId.length == 11 ){

			this.video.src = `https://www.youtube.com/embed/${videoId}`;

			// Custom Google Analytics tracking code
			/*let pageValue = '/pe-theater/playlist=' + this.videoList + '&currentVideo=' + videoId;

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

	toggleControlView(){

		if( this.controlMaximized === false ){

			this.maximizeControls();

		}else{

			this.minimizeControls();

		}

	},

	maximizeControls(){

		this.controlMaximized               = true;
		this.controller.style.top           = '0px';
		this.controllerButton.style.top     = `${this.controller.offsetHeight}px`;
		this.controllerButton.style.opacity = '1';
		this.controllerButton.innerHTML     = '-';

	},

	minimizeControls(){

		this.controlMaximized               = false;
		this.controller.style.top           = `-${this.controller.offsetHeight}px`;
		this.controllerButton.style.top     = '0px';
		this.controllerButton.style.opacity = '0.4';
		this.controllerButton.innerHTML     = '+';

	},

	setSize(){ // Called when viewer resizes browser window

		// Check if the theater is open
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

			// Set controller button position
			let controllerBtnLeftMargin = this.controllerButton.offsetWidth / 2;
			this.controllerButton.style.marginLeft = `-${controllerBtnLeftMargin}px`;

		}

	}

}