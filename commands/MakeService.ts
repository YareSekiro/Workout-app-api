import { join } from 'path'
import { args, BaseCommand } from '@adonisjs/core/build/standalone'

export default class MakeService extends BaseCommand {
    /**
     * Command name is used to run the command
     */
    public static commandName = 'make:service'

    @args.string({ description: 'Name of the service' })
    public name: string

    /**
     * Command description is displayed in the "help" output
     */
    public static description = 'Create a new service class'

    public static settings = {
        /**
         * Set the following value to true, if you want to load the application
         * before running the command. Don't forget to call `node ace generate:manifest`
         * afterwards.
         */
        loadApp: false,

        /**
         * Set the following value to true, if you want this command to keep running until
         * you manually decide to exit the process. Don't forget to call
         * `node ace generate:manifest` afterwards.
         */
        stayAlive: false,
    }

    public async run() {
        const name = this.name

        this.generator
            .addFile(this.name, {
                // force filename to be plural
                form: 'plural',

                // define ".ts" extension when not already defined
                extname: '.ts',

                // re-format the name to "camelCase"
                pattern: 'pascalcase',

                // add "Controller" suffix, when not already defined
                suffix: 'Service',
            })
            .appRoot(this.application.appRoot)
            .destinationDir('app/Services')
            .useMustache()
            .stub(join(__dirname, './templates/service.txt'))
            .apply({ name })

        await this.generator.run()
    }
}
