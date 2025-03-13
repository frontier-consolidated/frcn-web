String.prototype.toTitleCase = function (this: string) {
	return this[0].toUpperCase() + this.slice(1);
};
