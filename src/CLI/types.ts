import type Command from "./Command"
import type { Constructor } from "../types/General"

export type CommandConstructor = Constructor<Command> & typeof Command

export type CommandMap = {
    [Name: string]: CommandConstructor
}

export type PositionalArgPrefixConfig = {
    name: string,
    required: boolean
}

export type PositionalArgConfig = {
    pattern: PositionalArgument
    name: string
    required: boolean
    help?: string
    prefix?: PositionalArgPrefixConfig
}

export type PositionalArgsMap = {
    [position: number]: PositionalArgConfig
}

export type OptionType = 'string' | 'number' | 'boolean'
export type OptionValue = string | number | boolean
export type OptionConfig = {
    type: OptionType
    alias?: string
    defaultValue?: OptionValue
    help?: string
}

export type OptionsMap = {
    [key: string]: OptionConfig
}


export type LiteralArg = `<"${string}">` | `<'${string}'>`
export type EnumArg = `<(${string})>`
export type RegExpArg = `</${string}/>`
export type Arg = (
    '<?>' | '<int>' | '<float>' | LiteralArg | EnumArg | RegExpArg
)

export type NamedArg<Name extends string = string> = (
    `${Name}${'*' | '?' | ''}:${Arg}`
)

export type PositionalArgument = RegExp | Arg | NamedArg