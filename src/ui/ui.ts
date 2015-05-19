/// <reference path="../references.d.ts" />

import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as through from 'through';
import {Promise} from 'es6-promise';
import {EOL} from 'os';

var Progress: any = require('pleasant-progress');
var inquirer: any = require('inquirer');

var LOG_LEVEL = {
	ERROR: 5,
	WARN: 4,
	INFO: 3,
	DEBUG: 2,
	TRACE: 1
};

var PROMPTS = {
	INPUT: 'input',
	EXPAND: 'expand',
	CONFIRM: 'confirm',
	LIST: 'list',
	RAWLIST: 'rawlist',
	PASSWORD: 'password'
};

export default class Ui {
	static LOG_LEVEL = LOG_LEVEL;
	static PROMPTS = PROMPTS;

	protected chalk = chalk;
	protected Prompt = inquirer.ui.Prompt;
	protected input: NodeJS.ReadableStream;
	protected logLevel: number;
	protected output: through.ThroughStream;
	protected progress: { start: (message?: string, stepString?: string) => void; stop: (printWithFullStepString?: boolean) => void; };
	protected Promise = Promise;
	protected through = through;
	protected utils = _;
	
	constructor(protected options: models.ui.IOptions) {
		var progress = this.progress = new Progress();
		
		this.output = this.through(function (data: any) {
			progress.stop(true);
			this.emit('data', data);
		});
		
		this.output.setMaxListeners(0);
		this.output.pipe(options.output);
		this.input = options.input;
		this.setLogLevel(options.logLevel);
	}
	
	error(error: any): void {
		if(!this.utils.isObject(error)) {
			error = {
				message: error
			};
		}

		var message: string = error.message,
			stack: string = error.stack;
		
		if(this.utils.isString(stack)) {
			this.logLine(chalk.red(stack.slice(0, stack.indexOf(message) + message.length)), LOG_LEVEL.ERROR);
			this.logLine(stack.slice(stack.indexOf(message) + message.length + 1), LOG_LEVEL.ERROR);
			return;
		}

		if(this.utils.isString(message)) {
			this.logLine(chalk.red(message), LOG_LEVEL.ERROR);
		} else {
			this.logLine(chalk.red(error), LOG_LEVEL.ERROR);
		}
	}
	
	warn(message: string): void {
		this.logLine(message, LOG_LEVEL.WARN);
	}
	
	info(message: string): void {
		this.logLine(message, LOG_LEVEL.INFO);
	}
	
	debug(message: string): void {
		this.logLine(message, LOG_LEVEL.DEBUG);
	}
	
	trace(message: string): void {
		this.logLine(message, LOG_LEVEL.TRACE);
	}
	
	log(message: any, logLevel: number = LOG_LEVEL.INFO): void {
		if(this.shouldLog(logLevel)) {
			this.output.write(message);
		}
	}

	logLine(message: any, logLevel?: number): void {
		this.log(message + EOL, logLevel);
	}
	
	prompt(questions: Array<IQuestion>): Thenable<Array<any>> {
		return new this.Promise((resolve) => {
			inquirer.prompt(questions, resolve);
		});
	}

	startProgress(message?: string, stepString?: string): void {
		if(!this.shouldLog(LOG_LEVEL.INFO)) {
			return;
		}
		
		this.progress.start(message, stepString);
	}
	
	stopProgress(printWithFullStepString?: boolean): void {
		if(this.shouldLog(LOG_LEVEL.INFO)) {
			this.progress.stop(printWithFullStepString);
		}
	}

	setLogLevel(level: string | number): void {
		if(this.utils.isNumber((<any>LOG_LEVEL)[level])) {
			this.logLevel = (<any>LOG_LEVEL)[level];
		} else if(level >= LOG_LEVEL.TRACE && level <= LOG_LEVEL.ERROR) {
			this.logLevel = <number>level;
		} else {
			this.logLevel = LOG_LEVEL.INFO;
		}
	}
	
	protected shouldLog(logLevel: number = LOG_LEVEL.INFO): boolean {
		return logLevel >= this.logLevel;
	}
}