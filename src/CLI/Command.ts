// Types
import type {
    CommandOptionsMap,
    CommandOptionType,
    ComandOptionValue
} from "./types"

export default abstract class Command {
    private argsMap: { [position: number]: string[] } = {}
    private optsMap: CommandOptionsMap = {}

    private currentPosition: number = 0

    protected args: string[] = []
    protected opts: { [key: string]: any } = {}

    constructor(protected method?: string) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract execute(): void | Promise<void>

    // ------------------------------------------------------------------------

    public parseCommand(): void {
        this.define()

        for (const part of process.argv.slice(3)) {
            if (part.startsWith('--') || part.startsWith('-')) (
                this.handleOption(part)
            )

            else this.handleArg(part)
        }
    }

    // Protecteds -------------------------------------------------------------
    protected abstract define(): void

    // ------------------------------------------------------------------------

    protected arg(options: string[]) {
        const position = parseInt(Object.keys(this.argsMap).pop() ?? '0')
        this.argsMap[position + 1] = options
    }

    // ------------------------------------------------------------------------

    protected option(
        name: string,
        type: CommandOptionType = 'boolean',
        defaultValue?: ComandOptionValue
    ) {
        this.optsMap[name] = {
            type,
            defaultValue,
            value: defaultValue ?? false
        }
    }

    // Privates ---------------------------------------------------------------
    private handleArg(arg: string): void {
        this.currentPosition++
        if (
            this.argsMap[this.currentPosition] &&
            this.argsMap[this.currentPosition].includes(arg)
        ) (
            this.args.push(arg)
        )

        else throw new Error
    }

    // ------------------------------------------------------------------------

    private handleOption(option: string): void {
        let [key, value] = option.replace('--', '').split('=') as [string, any]
        if (!this.optsMap[key]) throw new Error

        if (this.optsMap[key].type === 'boolean') {
            this.optsMap[key].value = true
            return
        }

        value = value ?? process.argv[
            process.argv.indexOf(option) + 1
        ]

        if (!value) throw new Error

        switch (this.optsMap[key].type) {
            case "string":
                if (!(value.startsWith('"') || value.startsWith("'"))) throw (
                    new Error
                )

                this.opts[key] = value.slice(1, value.length - 1)
                return

            case "number":
                value = parseFloat(value)
                if (isNaN(value)) throw new Error

                this.opts[key] = value
                return
        }
    }
}