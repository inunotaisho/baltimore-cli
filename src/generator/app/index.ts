import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from '../../models/generator';
import ViewControl from '../viewcontrol/index';

export default class DefaultGenerator extends Generator {
	constructor(options: any) {
		super(options);
		this.destRoot('project/app');
	}

	initialize() {
	}

	run() {
		this.ui.debug('Generating the `default` app');

		var generator = this.instantiate(ViewControl, {
			env: this.env,
			directory: this.directory
		});

		var options = {
			appName: 'TEST',
			vcName: 'home'
		};

		return Promise.all([
			this.render('package.json', '../package.json', options),
			this.render('app.ts', 'app/app.ts', options),
			generator.run()
		]);
	}
}
