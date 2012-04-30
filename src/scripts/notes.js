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
	},

	save: function () {
		if ( this.isNew() ) {
			this.set( "created_at", Date.now() );
		}
		// call the "super" method
		Backbone.Model.prototype.save.apply( this, arguments );
	}
});

// Collection
Notes = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("Notes"),
	model: Note,
	parse: function ( items ) {
		// Sort these items
		items.sort( function ( a, b ) {
			var aCreated = a.created_at,
				bCreated = b.created_at;

			if ( aCreated === bCreated ) {
				return 0;
			}

			return aCreated > bCreated ? -1 : 1;
		});

		return items;
	}
});

// NoteView
NoteView = Backbone.View.extend({
	tagName: "div",
		initialize: function () {
		this.$el.attr( "data-role", "page" );
		this.template = _.template( $( "#note-view-template" ).html() );
		this.$el.appendTo( document.body );
		this.render();
	},

	render: function () {
		var data = this.model.toJSON();
		this.$el.jqmData( "url", "/notes/" + data.id );

		this.$el.html( this.template( {
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
	initialize: function () {
		_.bindAll( this, "render", "deleteRow" );

		this.collection.on( "reset", this.render );

		this.$content = this.$( ".ui-content" );
		this.template = _.template( $( "#notes-view-template" ).html() );

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
		e.preventDefault();
		var $row  = $( e.currentTarget ).closest( "li" ),
			model = this.collection.get( $row.data( "id" ) );

		console.log( $row.data( "id" ) );
		model.destroy();
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