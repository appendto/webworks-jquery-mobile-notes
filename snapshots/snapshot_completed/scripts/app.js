(function( app, $ ){

var $html = $( document.documentElement );


$html.on( "pageinit", "#home", function () {
	new app.NotesView({
		collection: app.notes,
		el: this
	});
});

$html.on( "pageinit", "#new-note", function () {
	new app.NewNoteView({
		collection: app.notes,
		el: this
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

app.notes.fetch();

$( document ).ready( function () {
	$( "#menu [data-role='button']" ).button();
});

$html.on( "swipedown", function () {
    $html.toggleClass( "show-menu" );
});

$html.on( "click", "#menu .ui-btn", function () {
    $html.removeClass( "show-menu" );
});
 
$html.on( "touchend", "#menu-overlay", function () {
    $html.removeClass( "show-menu" );
});

if ( window.blackberry ) {
    blackberry.app.event.onSwipeDown( function () {
        $html.trigger( "swipedown" );
    });
}

}( window.notesapp = window.notesapp || {}, jQuery ));