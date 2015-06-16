import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as mkdir from 'mkdirp';
import * as chalk from 'chalk';
import {registerHelpers} from 'swag';
import {Promise} from 'es6-promise';
import Command from './command';
import Environment from '../environment/environment';

registerHelpers(Handlebars);

export default class Generator extends Command {
	protected env: Environment;
	protected directory: string;
	private _srcRoot: string = '';
	private _destRoot: string = '';
	private _finishRender: Thenable<any> = Promise.resolve();

	constructor(options: IGeneratorOptions) {
		super(options);
		this.env = options.env;
		this.directory = options.directory;
		this.srcRoot(path.resolve(options.directory, 'templates'));
		this.destRoot(this.project.root);
	}

	protected render(source: string, destination: string, context?: any): Thenable<void> {
		var src = this.getPath(this._srcRoot, source),
			dest = this.getPath(this._destRoot, destination);

		var options: any = this.utils.extend({
			context: context,
			encoding: 'utf8'
		}, context);

		return this._finishRender = this._finishRender.then(() => {
			return this.read(src, options);
		})
		.then((data: string) => {
			data = Handlebars.compile(data, {
				noEscape: true
			})(options.context);
			return this.read(dest, options).then((data) => {
				this.ui.warn(`The file \`${dest.replace(this.project.root, '').replace(/\\/g, '/')}\` already exists.`);
				return this.ui.prompt([
					{ 
						type: 'confirm', 
						default: <any>true, 
						name: 'force', 
						choices: ['Y', 'n'], 
						message: 'Are you sure you want to overwrite it?'
					}
				]).then((answer: { force: boolean; }) => {
					if(!answer.force) {
						return;
					}

					return this.write(dest, data, options);
				});
			}, (err) => {
				return this.write(dest, data, options);
			});
		});
	}

	protected read(source: string, options: any = {}): Thenable<string> {
		this.ui.debug(`Reading from \`${source}\``);

		this.utils.defaults(options, {
			encoding: 'utf8'
		});

		return new Promise<string>((resolve, reject) => {
			fs.readFile(source, options, (err, data) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	}

	protected write(dest: string, data: string, options: any = {}): Thenable<void> {
		this.ui.debug(`Writing to \`${dest}\``);

		this.utils.defaults(options, {
			encoding: 'utf8'
		});

		return this.ensureWritable(dest)
			.then(() => {
				return new Promise<void>((resolve, reject) => {
					fs.writeFile(dest, data, options, (err) => {
						if(err) {
							reject(err);
							return;
						}

						resolve();
					});
				});
			});
	}

	protected ensureWritable(file: string): Thenable<any> {
		return this.mkdir(path.dirname(file));
	}

	protected mkdirDest(...dirs: Array<string>): Thenable<any> {
		return this.mkdir.apply(this, dirs.map((dir) => {
			return this.getPath(this._destRoot, dir);
		}));
	}

	protected mkdir(...dirs: Array<string>): Thenable<any> {
		return Promise.all(dirs.map((dir) => {
			return new Promise((resolve, reject) => {
				mkdir(dir, (err) => {
					if(this.utils.isObject(err)) {
						reject(err);
						return;
					}

					resolve();
				});
			});
		}));
	}

	protected srcRoot(source?: string): string {
		return this._srcRoot = this.getPath(this._srcRoot, source);
	}

	protected destRoot(dest?: string): string {
		return this._destRoot = this.getPath(this._destRoot, dest);
	}

	protected eol(data: string): string {
		var cr = '\r',
			lf = '\n',
			r = data.indexOf(r),
			n = data.indexOf(n);

		if(r > -1 && r < n) {
			return cr + lf;
		}

		return lf;
	}

	protected mapLines(handler: (line: string, index: number, lines: Array<string>) => string, data: string): string {
		var eol = this.eol(data),
			lines = data.split(eol);

		return this.utils.map(lines, handler).join(eol);
	}

	private getPath(source: string, append: string): string {
		if(this.utils.isEmpty(source) || path.isAbsolute(append)) {
			source = append;
		} else {
			source = path.resolve(source, append || '.');
		}

		return source;
	}
}

interface IGeneratorOptions extends models.IModelOptions {
	env: Environment;
	directory: string;
}
