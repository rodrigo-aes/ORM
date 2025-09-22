// Utils
import { isRegExp } from "util/types"

// Types
import type {
    CommandOptionsMap,
    CommandOptionType,
    ComandOptionValue,
    ArgPattern
} from "./types"

export default abstract class Command {
    private argsMap: { [position: number]: ArgPattern | string[] } = {}
    private optsMap: CommandOptionsMap = {}

    private handled: Set<string> = new Set
    private currentPosition: number = 0

    protected args: (ArgPattern | string | number)[] = []
    protected opts: { [key: string]: any } = {}

    private static get isInt() {
        return this.regExpTest(/^-?\d+$/)
    }

    private static get isFloat() {
        return this.regExpTest(
            /^[ \t\n\r]*[+-]?(Infinity|(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)/
        )
    }


    constructor(protected method?: string) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract execute(): void | Promise<void>

    // ------------------------------------------------------------------------

    public parseCommand(): void {
        this.define()

        for (const [key, part] of Object.entries(process.argv.slice(3))) {
            if (this.handled.has(key)) continue

            if (part.startsWith('--') || part.startsWith('-')) (
                this.handleOption(part)
            )
            else this.handleArg(part)

            this.handled.add(key)
        }
    }

    // Protecteds -------------------------------------------------------------
    protected abstract define(): void

    // ------------------------------------------------------------------------

    protected arg(options: ArgPattern | string[]) {
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

        if (this.argsMap[this.currentPosition]) this.args.push(
            this.parseArg(this.argsMap[this.currentPosition], arg)
        )

        else throw new Error
    }

    // ------------------------------------------------------------------------

    private parseArg(mapped: ArgPattern | string[], arg: string): (
        string | number
    ) {
        if (Array.isArray(mapped) && mapped.includes(arg)) return arg
        if (isRegExp(mapped) && mapped.test(arg)) return arg

        switch (mapped) {
            case '<?>': return arg

            case "<int>": if (Command.isInt(arg)) return parseInt(arg)
                break

            case "<float>": if (Command.isFloat(arg)) return parseFloat(arg)
                break
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    private handleOption(option: string): void {
        let [key, value] = option.replace('--', '').split('=') as [string, any]
        if (!this.optsMap[key]) throw new Error

        if (this.optsMap[key].type === 'boolean') {
            if (value) throw new Error
            this.optsMap[key].value = true
            return
        }

        if (!value) {
            const next = process.argv.indexOf(option) + 1
            value = process.argv[next]
            this.handled.add((next - 3).toString())
        }

        if (!value) throw new Error

        switch (this.optsMap[key].type) {
            case "string":
                value.replace(/^(['"])(.*)\1$/, "$2")
                this.opts[key] = value
                break

            case "number":
                value = parseFloat(value)
                if (isNaN(value)) throw new Error

                this.opts[key] = value
                break
        }
    }

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static regExpTest(regExp: RegExp): Function {
        return regExp.test.bind(regExp)
    }
}