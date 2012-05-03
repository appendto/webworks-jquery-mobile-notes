(function( app, $ ){

// Handle the preview sizes (no storage yet)
var previewSizes = "preview-less preview-average preview-more",
	$html = $( "html" ),
	notesView, newNoteView;

$html.on( "change", ".preview-size", function ( e ) {
	var value = $( this ).find( ":checked" ).val();
	$html.removeClass( previewSizes ).addClass( "preview-" + value );
});

// Handle the swipe menu
if ( window.blackberry ) {
	// Handle actual swipe event
	blackberry.app.event.onSwipeDown( function () {
		$html.toggleClass( "show-menu" );
	});

	// Close if a button is clicked
	$html.on( "click", "#menu .ui-btn", function () {
		$html.removeClass( "show-menu" );
	});

	// Close if the overlay is touched
	$html.on( "touchend", "#menu-overlay", function () {
		$html.removeClass( "show-menu" );
	});

	// Prevent the overlay from scrolling the page
	$html.on( "touchstart", "#menu-overlay", function ( e ) {
		e.preventDefault();
	});
}

// Setup our one item that is outside the normal pages
$( document ).ready( function () {
	$( "#menu [data-role='button']" ).button();
});

$html.on( "pageinit", "#home", function () {
	notesView = new app.NotesView({
		el: this,
		collection: app.notes
	});
});

$html.on( "pagebeforeshow", "#home", function () {
	app.notes.fetch();
});

app.notes.fetch();

$html.on( "pageinit", "#new-note", function () {
	newNoteView = new app.NewNoteView({
		el: this,
		collection: app.notes
	});
});

$html.on( "pagebeforechange", function ( e, data ) {
	var page, url;
	if ( typeof data.toPage === "string" && !$.mobile.path.isEmbeddedPage( data.toPage ) ) {
		url = $.mobile.path.parseUrl( data.toPage );

		if ( url.directory === "/notes/" ) {
			page = new app.NoteView({
				model: app.notes.get( url.filename )
			});
			page.$el.appendTo( document.body );
			
			data.options.dataUrl = data.toPage;
			data.toPage = page.$el;
		}
	}
});



}( window.notesapp = window.notesapp || {}, jQuery ));