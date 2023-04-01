registerPlugin({
	install: function (less, pluginManager, functions) {

		/**
		 * join()
		 */
		functions.add('join', function (list, sep) {
			let r = [];
			list = Array.isArray(list.value) ? list.value : [list];
			list.forEach(item => {
				r.push(item.quote ? (item.quote + item.value + item.quote) : item.value);
			});
			return r.join(sep ? sep.value : ', ');
		});

	}
});