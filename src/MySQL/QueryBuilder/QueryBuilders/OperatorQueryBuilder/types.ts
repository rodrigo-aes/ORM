import type {
    Primitive
} from "../../ConditionalSQLBuilder/Operator/types"

export type OperatorType = {
    '=': Primitive
    '!=': Primitive
    '<': number | Date
    '>': number | Date
    '<=': number | Date
    '>=': number | Date
    'BETWEEN': [number | Date, number | Date]
    'NOT BETWEEN': [number | Date, number | Date]
    'IN': Primitive[]
    'NOT IN': Primitive[]
    'LIKE': string
    'NOT LIKE': string
    'IS NULL': never
    'IS NOT NULL': never
    'REGEXP': RegExp | string
    'NOT REGEXP': RegExp | string
    'NOT': any
    'EXISTS': string | object
    'NOT EXISTS': string | object
    'ANY': Primitive[] | string
    'ALL': Primitive[] | string
}

export type StringOpertors = (
    '=' |
    '!=' |
    'IN' |
    'NOT IN' |
    'LIKE' |
    'NOT LIKE' |
    'IS NULL' |
    'IS NOT NULL' |
    'REGEXP' |
    'NOT REGEXP'
)

export type NumberOperators = (
    '=' |
    '!=' |
    '<' |
    '<=' |
    '>' |
    '>=' |
    'BETWEEN' |
    'NOT BETWEEN' |
    'IN' |
    'NOT IN' |
    'IS NULL' |
    'IS NOT NULL'
)

export type DateOperators = (
    '=' |
    '!=' |
    '<' |
    '<=' |
    '>' |
    '>=' |
    'BETWEEN' |
    'NOT BETWEEN' |
    'IN' |
    'NOT IN' |
    'IS NULL' |
    'IS NOT NULL'
)

export type BooleanOperators = (
    '=' |
    '!=' |
    'IN' |
    'NOT IN' |
    'IS NULL' |
    'IS NOT NULL'
)

export type CompatibleOperators<T = any> = (
    T extends string
    ? StringOpertors
    : T extends number
    ? NumberOperators
    : T extends Date
    ? DateOperators
    : T extends boolean
    ? BooleanOperators
    : never
)