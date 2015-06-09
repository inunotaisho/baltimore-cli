import Command from '../models/command';

class Create extends Command {
	static commandName: string = 'create';

	protected args: ICreateArgs;

	run(): any {
		var component = this.commands[0];
		return this.env.generator(component).run();
	}
}

export = Create;

interface ICreateArgs {
	
}
