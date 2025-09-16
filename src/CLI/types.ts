import type Command from "./Command"
import type { Constructor } from "../types/General"

export type CommandMap = {
    [Name: string]: Constructor<Command>
}

export type CommandOptionType = 'string' | 'number' | 'boolean'
export type ComandOptionValue = string | number | boolean

export type CommandOptionsMap = {
    [key: string]: {
        type: CommandOptionType
        value: ComandOptionValue
        defaultValue?: ComandOptionValue
    }
}