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
	parse: function ( data ) {
		return data.reverse();
	}
});

// NoteView
NoteView = Backbone.View.extend({
	templateId: "#note-view-template",

	attributes: {
		"data-role": "page"
	},

	initialize: function () {
		this.template = _.template( $( this.templateId ).html() );

		this.render()
	},

	render: function () {
		var data = this.model.toJSON();

		this.$el.html( this.template({
			note: data,
			textHelper: textHelper
		}));
	}
});

// NoteView
NewNoteView = Backbone.View.extend({
	events: {
		"click .done": "saveNote",
		"submit form": "saveNote"
	},

	initialize: function () {
		_.bindAll( this, "focus", "reset" );
		this.$text = this.$( "textarea" );

		this.$el.on( "pageshow", this.focus);
		this.$el.on( "pagebeforeshow", this.reset);
	},

	focus: function () {
		this.$text.focus();
	},

	reset: function () {
		this.$text.val( '' ); // reset
	},

	saveNote: function () {
		var text = $.trim( this.$text.val() );

		if ( text === "" ) {
			alert( "You must enter a note!" );
			return;
		}

		this.collection.create({
			"text": text
		}, {
			success: function () {
				$.mobile.changePage( "/index.html" );
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
		_.bindAll( this, "render", "fetch" );

		this.$el.bind( "pagebeforeshow", this.fetch );
		this.collection.on( "reset", this.render );

		this.$content = this.$( ".ui-content" );
		this.template = _.template( $( this.templateId ).html() );

		this.render();
	},

	fetch: function () {
		this.collection.fetch();
	},

	render: function () {
		var notes = this.collection.toJSON();
		this.$content
				.html( this.template({
					notes: notes,
					textHelper: textHelper
				}))
				.trigger( "pagecreate" );
	}
});

_.extend( app, {
	notes: new Notes(),
	NoteView: NoteView,
	NewNoteView: NewNoteView,
	NotesView: NotesView
});

}( window.notesapp = window.notesapp || {}, jQuery, _, Backbone));