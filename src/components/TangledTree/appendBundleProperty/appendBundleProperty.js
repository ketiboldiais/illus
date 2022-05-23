export const appendBundleProperty = (_levels) => {
	_levels.forEach((l, i) => {
		var index = {};
		l.forEach((n) => {
			if (n.parents.length == 0) {
				return;
			}
			var id = n.parents
				.map((d) => d.id)
				.sort()
				.join("--");
			if (id in index) {
				index[id].parents = index[id].parents.concat(n.parents);
			} else {
				index[id] = { id: id, parents: n.parents.slice(), level: i };
			}
			n.bundle = index[id];
		});
		l.bundles = Object.keys(index).map((k) => index[k]);
		l.bundles.forEach((b, i) => (b.i = i));
	});
};
