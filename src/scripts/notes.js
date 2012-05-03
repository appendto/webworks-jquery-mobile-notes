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
	model: Note
});

// NoteView
NoteView = Backbone.View.extend({

});

// NoteView
NewNoteView = Backbone.View.extend({
	initialize: function () {
		_.bindAll( this, "focus" );
		this.$text = this.$( "textarea" );
	},

	focus: function () {
		this.$text.focus();
	},

	reset: function () {
		this.$text.val( '' ); // reset
	},

	saveNote: function () {
		var text = "sample";

		this.collection.create({
			"text": text
		}, {
			success: function () {

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
		_.bindAll( this, "render" );

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
				}));
	}
});

_.extend( app, {
	notes: new Notes(),
	NoteView: NoteView,
	NewNoteView: NewNoteView,
	NotesView: NotesView
});

}( window.notesapp = window.notesapp || {}, jQuery, _, Backbone));