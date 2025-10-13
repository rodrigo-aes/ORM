import type { DataType } from "../../Metadata"

export type ProcedureArgs<
    K extends readonly string[] = string[],
    V extends readonly any[] = any[]
> = [K, V]

export type ProcedureArgsObject<
    K extends readonly string[] = string[],
    V extends readonly any[] = any[]
> = (
        {
            [I in keyof K]: {
                [P in K[I] & PropertyKey]: I extends keyof V
                ? V[I]
                : never
            }
        }[number] extends infer O
        ? { [P in keyof O]: O[P] }
        : never
    )

export type ProcedureArgsSchemaObject<
    K extends readonly string[] = string[],
    V extends readonly any[] = any[]
> = {
        [I in Extract<keyof K, `${number}`> as K[I] & PropertyKey]: DataType
    }

export type ProcedureArgsSchema<T extends ProcedureArgs> =
    T extends [infer K extends readonly string[], infer V extends readonly any[]]
    ? ProcedureArgsSchemaObject<K, V>
    : never


export type ProcedureOutKey<K extends string> = `@${K}`

export type ProcedureOutResult<T extends ProcedureArgsObject<any, any>> = {
    [K in keyof T as ProcedureOutKey<Extract<K, string>>]: T[K]
}

export type OptionalizeTuple<T extends readonly any[]> = {
    [K in keyof T]: undefined extends T[K] ? T[K] | undefined : T[K]
};