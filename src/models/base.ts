/// <reference path="../references.d.ts" />

export default class BaseObject {
	ui: ui.Ui;

	constructor(options: models.IModelOptions) {
		this.ui = options.ui;
	}
}
