(function ( app, $, _, Backbone ) {

var Note, Notes, NoteView, NewNoteView, NotesView, textHelper;

textHelper = function ( input ) {
	return _.escape( input ).replace( /\n/g, "<br>" );
};

// Model
Note = Backbone.Model.extend({
	defaults: {
		text: "",
		audio: ""
	}
});

// Collection
Notes = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage( "Notes" ),
	model: Note,
	parse: function ( items ) {
		return items.reverse();
	}
});

// NoteView
NoteView = Backbone.View.extend({
	tagName: "div",

	templateId: "#note-view-template",

	attributes: {
		"data-role": "page"
	},
	
	initialize: function () {
		// Cache the template
		this.template = _.template( $( this.templateId ).html() );

		// Render
		this.render();
	},

	render: function () {
		var note = this.model.toJSON();
		this.$el.jqmData( "url", "/notes/" + note.id );

		this.$el.html(
			this.template({
				note: note,
				textHelper: textHelper
			})
		);
	}
});

// NoteView
NewNoteView = Backbone.View.extend({
	events: {
		"click .done": "saveNote",
		"submit form": "saveNote"
	},

	initialize: function () {
		_.bindAll( this, "focus" );
		this.$text = this.$( "textarea" );

		this.$el.bind( "pageshow", this.focus )
	},

	focus: function () {
		this.$text.focus();
	},

	reset: function () {
		this.$text.val( '' ); // reset
	},

	saveNote: function () {
		var text = this.$text.val();

		text = $.trim( text );

		if ( text === "" ) {
			alert( "Your note must contain content!" );
			return;
		}

		this.collection.create({
			"text": text
		}, {
			success: function () {
				$.mobile.changePage( "/index.html", {
					transition: "slideup",
					reverse: true
				});
			},
			error: function () {
				alert( "There was a problem saving your note!" );
			}
		});
	}
});

// Notes List View
NotesView = Backbone.View.extend({
	templateId: "#notes-view-template",

	initialize: function () {
		_.bindAll( this, "render", "deleteRow" );

		this.collection.on( "reset", this.render );

		this.$content = this.$( ".ui-content" );
		this.template = _.template( $( this.templateId ).html() );

		this.render();
	},

	render: function () {
		var notes = this.collection.toJSON();
		this.$content
				.html( this.template({
					notes: notes,
					textHelper: textHelper
				}))
				.trigger( "pagecreate" );

		this.$('li').swipeDelete({ 
			click: this.deleteRow,
			direction: 'swipeleft'
		});
	},

	deleteRow: function ( e ) {
		var $row  = $( e.currentTarget ).closest( "li" ),
			id    = $row.data( "id" ),
			model = this.collection.get( id );

		// Destroy the data
		model.destroy();
		
		// Visually remove the row
		$row.slideUp( function () {
			$row.remove();
		});
	}
});

_.extend( app, {
	notes: new Notes(),
	NoteView: NoteView,
	NewNoteView: NewNoteView,
	NotesView: NotesView
});

}( window.notesapp = window.notesapp || {}, jQuery, _, Backbone));