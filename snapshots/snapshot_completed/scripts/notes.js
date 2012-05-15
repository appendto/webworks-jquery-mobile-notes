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
		var note = this.model.toJSON();
		this.$el.html(
			this.template({
				note: note,
				textHelper: textHelper
			})
		);
	}
});

// NewNoteView
NewNoteView = Backbone.View.extend({
	events: {
		"click .done": "saveNote",
		"submit form": "saveNote"
	},

	initialize: function () {
		_.bindAll( this, "focus", "reset" );
		this.$text = this.$( "textarea" );

		this.$el.on( "pagebeforeshow", this.reset);
		this.$el.on( "pageshow", this.focus);
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
			alert( "Please add some text." );
			return;
		}

		this.collection.create({
			"text": text
		}, {
			success: function () {
				$.mobile.changePage( "index.html", {
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
		_.bindAll( this, "render" );

		this.collection.on( "reset", this.render );

		this.$el.on( "pagebeforeshow", function () {
			app.notes.fetch();
		});

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
		this.$content.trigger( "pagecreate" );
		this.$( ".ui-listview-filter input" ).attr( "autocomplete", "off" );
	}
});

_.extend( app, {
	notes: new Notes(),
	NoteView: NoteView,
	NewNoteView: NewNoteView,
	NotesView: NotesView
});

}( window.notesapp = window.notesapp || {}, jQuery, _, Backbone));