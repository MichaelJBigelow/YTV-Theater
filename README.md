# YTV-Theater
The YTV Theater is a project aiming to make YouTube video viewing on websites more enjoyable.

## Usage

Include `css/ytv-theater.css` and `js/ytv-theater.js` (with `defer`), add the theater markup from `index.html`, and give each playlist a `<select class="pe-theater-video-selector" id="My_Playlist">` whose options' values are YouTube video IDs.

Open a playlist from markup:

```html
<button type="button" data-ytv-playlist="My_Playlist">My Playlist</button>
```

or from script with `theater.open("My_Playlist")`. The theater initializes itself when the page loads.

Serve the page over `http(s)`. YouTube only plays embeds whose request carries a `Referer` header, so a page opened straight from disk (`file://`) shows "Error 153: Video player configuration error". The theater sets `referrerpolicy="strict-origin-when-cross-origin"` on the player so the page's origin is sent even when the site's own referrer policy is stricter.

Each time a video loads, a `ytv-theater:videochange` event is dispatched on `document` with `{ playlist, videoId }` in its `detail`, which you can use for analytics:

```js
document.addEventListener("ytv-theater:videochange", (event) => {
	console.log(event.detail.playlist, event.detail.videoId);
});
```
