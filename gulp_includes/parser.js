var Class = require('js.class');
var $ = {};

$.Parser = Class({
	/**
	 * @param string Source
	 */
	create: function (Source) {
		this.contexts = new $.ContextManager();
		this.source = new $.Text(Source);
		this.currentChunk = 0;
	},
	parse: function () {
		do {
			this.parseChunk();

		} while (this.hasNextChunk())
		// Parse each chunks
		for (var i = 0; i < chunks.length; i++) {
			var chunk = chunks[i].trim();
			var context = contexts[contexts.length - 1];
		}
	},
	parseChunk: function () {
		var chunk = this.source.getChunk(this.currentChunk);
		if (this.contexts.parse());
		//if (this.hasNextChunk()) this.currentChunk++;
	},
	/**
	 * @return boolean
	 */
	hasNextChunk: function () {
		return this.currentChunk < (this.source.getNChunks() - 1);
	}
});

$.Text = Class({
	/**
	 * @param string Content
	 */
	create: function (Content) {
		this.content = Content;
		this.chunks = Content.split(/\n/);
	},
	/**
	 * @return string
	 */
	getContent: function () {
		return this.content;
	},
	/**
	 * @param int Index
	 * @return string
	 */
	getChunk: function (Index) {
		if (Index >= this.chunks.length) return "";
		return this.chunks[Index];
	},
	/**
	 * @return int
	 */
	getNChunks: function () {
		return this.chunks.length;
	}
});

$.ContextManager = Class({
	create: function () {
		this.contexts = [];
	},
	/**
	 * @param Context Context
	 */
	addContext: function (Context) {
		this.contexts.push(Context);
	},

});

$.Dependency = Class({

});

$.Context = Class({
	create: function () {
		this.data = {};
	},
	/**
	 * @return RegExp
	 */
	getOpener: function () {
		return this.opener;
	},
	/**
	 * @return RegExp
	 */
	getCloser: function () {
		return this.closer;
	},
	/**
	 * @return Context
	 */
	getCurrent: function () {
		return this.current;
	},
	/**
	 * @return object
	 */
	getData: function () {
		return this.data;
	},
	/**
	 * @param RegExp Pattern
	 */
	setOpener: function (Pattern) {
		this.opener = Pattern;
		return this;
	},
	/**
	 * @param RegExp Pattern
	 */
	setCloser: function (Pattern) {
		this.closer = Pattern;
		return this;
	},
	/**
	 * @param string Chunk
	 */
	parse: function (Chunk) {
		var chunk = Chunk.trim();
		this.current.fnParse(this.data);
	}

}).static({
	create: function () {

	}
});

// DEBUG
(function () {
	var parser = new $.Parser("Foo Bar");
	parser.getContext().addChild()
	var Doc = new $.Context();
	Doc.setOpener(/^\/\*{2}$/);
	Doc.setCloser(/^\*\//);

})();

module.exports = $;
