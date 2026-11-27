/**
 * YTV Theater
 *
 * Shows a YouTube playlist in a full-window theater overlay.
 *
 * Open a playlist from markup with `data-ytv-playlist="<select id>"`, or from
 * script with `theater.open( "<select id>" )`. Every video change dispatches a
 * `ytv-theater:videochange` event on `document` (useful for analytics).
 */
class YTVTheater {

	static revision = "11.27.2026.3";

	static #videoIdPattern = /^[\w-]{11}$/; // YouTube video IDs are 11 URL-safe characters

	#active            = false;
	#controlsMaximized = true;
	#playlist          = null; // The <select> of the playlist that is open
	#elements          = null;

	get active(){

		return this.#active;

	}

	get controlsMaximized(){

		return this.#controlsMaximized;

	}

	get playlistTitle(){

		return this.#playlist?.id ?? "";

	}

	initialize(){

		if( this.#elements ){ // Safe to call more than once

			return true;

		}

		const elements = {
			shader:           document.getElementById( "pe-theater-shader" ),
			videoContainer:   document.getElementById( "pe-theater-video-container" ),
			video:            document.getElementById( "pe-theater-youtube-video" ),
			controller:       document.getElementById( "pe-theater-controller" ),
			controllerButton: document.getElementById( "pe-theater-controller-button" ),
		};

		const missing = Object.entries( elements ).filter( ( [ , element ] ) => element === null );

		if( missing.length > 0 ){

			console.error( `YTV Theater: missing required elements: ${missing.map( ( [ name ] ) => name ).join( ", " )}.` );
			return false;

		}

		this.#elements = elements;

		const { shader, video, controller, controllerButton } = elements;

		// YouTube refuses embeds that arrive without a Referer header ("Error 153: Video player
		// configuration error"), so make sure the page's origin is always sent, whatever the
		// host page's own referrer policy is.
		video.referrerPolicy = "strict-origin-when-cross-origin";

		if( location.protocol === "file:" ){

			console.warn( "YTV Theater: YouTube embeds need a Referer header, which pages opened from file:// cannot send. Serve this page over http(s) or the player will show Error 153." );

		}

		controller.setAttribute( "role", "region" ); // A generic <div> cannot carry an accessible name
		controller.setAttribute( "aria-label", "Video list" );
		controllerButton.setAttribute( "aria-controls", controller.id );

		if( !( controllerButton instanceof HTMLButtonElement ) ){ // Older markup used a <div>; keep it keyboard reachable

			controllerButton.setAttribute( "role", "button" );
			controllerButton.tabIndex = 0;
			controllerButton.addEventListener( "keydown", ( event ) => {

				if( event.key === "Enter" || event.key === " " ){

					event.preventDefault();
					this.toggleControlView();

				}

			} );

		}

		shader.addEventListener( "click", () => this.close() );
		controllerButton.addEventListener( "click", () => this.toggleControlView() );

		controller.addEventListener( "change", ( event ) => {

			if( event.target.matches( ".pe-theater-video-selector" ) ){

				this.loadVideo( event.target.value );

			}

		} );

		document.addEventListener( "click", ( event ) => {

			const trigger = event.target.closest( "[data-ytv-playlist]" );

			if( trigger ){

				event.preventDefault();
				this.open( trigger.dataset.ytvPlaylist );

			}

		} );

		// Keep the toggle button pinned under the controller whenever the controller's height changes
		new ResizeObserver( () => this.#syncControllerButton() ).observe( controller );

		return true;

	}

	open( playlistName ){

		if( !this.initialize() ){

			return;

		}

		const playlist = playlistName ? document.getElementById( playlistName ) : null;

		if( !playlist?.classList.contains( "pe-theater-video-selector" ) ){

			alert( playlistName
				? `The ${playlistName.replaceAll( "_", " " )} playlist could not be found.`
				: "That is not a valid playlist name." );
			return;

		}

		this.#playlist?.classList.remove( "is-selected" ); // Hide any playlist that was already open
		this.#playlist = playlist;
		this.#playlist.classList.add( "is-selected" );

		this.#active = true;
		document.documentElement.classList.add( "pe-theater-active" );
		this.maximizeControls();

		this.loadVideo( playlist.value );

	}

	close(){

		if( !this.#active ){

			return;

		}

		document.documentElement.classList.remove( "pe-theater-active" );
		this.#playlist?.classList.remove( "is-selected" );
		this.#elements.video.src = "about:blank"; // Stop playback instead of leaving it running hidden
		this.#active             = false;

	}

	loadVideo( videoId ){

		if( !this.initialize() ){

			return false;

		}

		const id = String( videoId ?? "" ).replace( /\s/g, "" );

		if( !YTVTheater.#videoIdPattern.test( id ) ){

			this.#elements.video.src = "about:blank"; // Unload the previous video
			alert( "Invalid video ID." );
			return false;

		}

		this.#elements.video.src = `https://www.youtube.com/embed/${id}`;

		document.dispatchEvent( new CustomEvent( "ytv-theater:videochange", {
			detail: { playlist: this.playlistTitle, videoId: id },
		} ) );

		return true;

	}

	toggleControlView(){

		if( this.#controlsMaximized ){

			this.minimizeControls();

		}else{

			this.maximizeControls();

		}

	}

	maximizeControls(){

		this.#setControlsMaximized( true );

	}

	minimizeControls(){

		this.#setControlsMaximized( false );

	}

	#setControlsMaximized( maximized ){

		if( !this.initialize() ){

			return;

		}

		const { controller, controllerButton } = this.#elements;

		this.#controlsMaximized = maximized;
		controller.classList.toggle( "is-minimized", !maximized );
		controllerButton.classList.toggle( "is-minimized", !maximized );
		controllerButton.textContent = ""; // The icon comes from the stylesheet
		controllerButton.setAttribute( "aria-expanded", String( maximized ) );
		controllerButton.setAttribute( "aria-label", maximized ? "Hide video list" : "Show video list" );
		controllerButton.title = controllerButton.getAttribute( "aria-label" );
		this.#syncControllerButton();

	}

	#syncControllerButton(){

		const { controller, controllerButton } = this.#elements;
		controllerButton.style.setProperty( "--pe-theater-controller-height", `${controller.offsetHeight}px` );

	}

}

const theater = new YTVTheater();

if( document.readyState === "loading" ){

	document.addEventListener( "DOMContentLoaded", () => theater.initialize(), { once: true } );

}else{

	theater.initialize();

}
