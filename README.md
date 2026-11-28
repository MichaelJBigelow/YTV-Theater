# YTV-Theater
The YTV Theater is a project aiming to make YouTube video viewing on websites more enjoyable.

## Usage

Include `css/ytv-theater.css` and `js/ytv-theater.js` (with `defer`), add the theater markup, and put one `<select class="ytv-theater-video-selector">` per playlist inside `#ytv-theater-controller`. Each select's `id` names the playlist, and its options' values are YouTube video IDs. A complete page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="css/ytv-theater.css">
</head>
<body>

	<!-- Opens the playlist whose select has this id -->
	<button type="button" data-ytv-playlist="My_Playlist">My Playlist</button>

	<!-- Theater markup -->
	<div id="ytv-theater-shader"></div>
	<div id="ytv-theater-video-container">
		<iframe id="ytv-theater-youtube-video" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
	</div>
	<div id="ytv-theater-controller">
		<select class="ytv-theater-video-selector" id="My_Playlist">
			<option value="Q6aUbwMpz9k">First video title</option>
			<option value="PyXYDFK22oI">Second video title</option>
		</select>
		<!-- More playlists: add another select with its own id -->
	</div>
	<button type="button" id="ytv-theater-controller-button" aria-label="Hide video list"></button>

	<script src="js/ytv-theater.js" defer></script>
</body>
</html>
```

Open a playlist from markup with a `data-ytv-playlist` attribute, as above, or from script with `theater.open("My_Playlist")`. The theater initializes itself when the page loads. `index.html` is a working demo.

Serve the page over `http(s)`. YouTube only plays embeds whose request carries a `Referer` header, so a page opened straight from disk (`file://`) shows "Error 153: Video player configuration error". The theater sets `referrerpolicy="strict-origin-when-cross-origin"` on the player so the page's origin is sent even when the site's own referrer policy is stricter.

Each time a video loads, a `ytv-theater:videochange` event is dispatched on `document` with `{ playlist, videoId }` in its `detail`, which you can use for analytics:

```js
document.addEventListener("ytv-theater:videochange", (event) => {
	console.log(event.detail.playlist, event.detail.videoId);
});
```

## Theming

The theater follows Material Design 3 (dark scheme). Override its custom properties on `:root` to match your site, for example:

```css
:root{
	--ytv-primary: #ffb4ab;
	--ytv-surface-container: #201a19;
}
```

The defaults have zero specificity, so your `:root` rule wins whether it loads before or after the theater's stylesheet. The select's drop-down arrow is an image; for a light scheme, set `--ytv-select-icon` to a darker `url(...)`. See the top of `css/ytv-theater.css` for the full list.
