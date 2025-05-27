import {
    Equal,
    NotEqual,
    Or,
    LT,
    GT,
    LTE,
    GTE,
    Between,
    NotBetween,
    In,
    NotIn,
    Like,
    NotLike,
    Null,
    NotNull,
    RegExp,
    NotRegExp,
    Not,
    Exists,
    NotExists,
    Any,
    All,
} from './Symbols'

import type { OrOperatorValue } from './Or/types'

export type Primitive = string | number | boolean | Date | null

export type OperatorKey = (
    typeof Equal |
    typeof NotEqual |
    typeof Or |
    typeof LT |
    typeof GT |
    typeof LTE |
    typeof GTE |
    typeof Between |
    typeof NotBetween |
    typeof In |
    typeof NotIn |
    typeof Like |
    typeof NotLike |
    typeof Null |
    typeof NotNull |
    typeof RegExp |
    typeof NotRegExp
    // typeof Not |
    // typeof Exists |
    // typeof NotExists |
    // typeof Any |
    // typeof All |
)

export type OperatorType<T extends any = any> = {
    [Equal]: Primitive
    [NotEqual]: Primitive
    [Or]: OrOperatorValue<T>
    [LT]: number | Date
    [GT]: number | Date
    [LTE]: number | Date
    [GTE]: number | Date
    [Between]: [number | Date, number | Date]
    [NotBetween]: [number | Date, number | Date]
    [In]: Primitive[]
    [NotIn]: Primitive[]
    [Like]: string
    [NotLike]: string
    [Null]: true
    [NotNull]: true
    [RegExp]: RegExp | string
    [NotRegExp]: RegExp | string
    [Not]: any
    [Exists]: string | object
    [NotExists]: string | object
    [Any]: Primitive[] | string
    [All]: Primitive[] | string
}

export type StringOperators = (
    { [Equal]: Primitive } |
    { [Or]: OrOperatorValue<string | null> } |
    { [NotEqual]: Primitive } |
    { [In]: Primitive[] } |
    { [NotIn]: Primitive[] } |
    { [Like]: string } |
    { [NotLike]: string } |
    { [Null]: true } |
    { [NotNull]: true } |
    { [RegExp]: RegExp | string } |
    { [NotRegExp]: RegExp | string }
)

export type NumberOperators = (
    { [Equal]: Primitive } |
    { [NotEqual]: Primitive } |
    { [Or]: OrOperatorValue<number | null> } |
    { [LT]: number | Date } |
    { [GT]: number | Date } |
    { [LTE]: number | Date } |
    { [GTE]: number | Date } |
    { [Between]: [number | Date, number | Date] } |
    { [NotBetween]: [number | Date, number | Date] } |
    { [In]: Primitive[] } |
    { [NotIn]: Primitive[] } |
    { [Null]: true } |
    { [NotNull]: true }
)

export type BooleanOperators = (
    { [Equal]: Primitive } |
    { [NotEqual]: Primitive } |
    { [Or]: OrOperatorValue<boolean | null> } |
    { [Null]: true } |
    { [NotNull]: true }
)

export type DateOperators = (
    { [Equal]: Primitive } |
    { [NotEqual]: Primitive } |
    { [Or]: OrOperatorValue<Date | string | null> } |
    { [LT]: number | Date } |
    { [GT]: number | Date } |
    { [LTE]: number | Date } |
    { [GTE]: number | Date } |
    { [Between]: [number | Date, number | Date] } |
    { [NotBetween]: [number | Date, number | Date] } |
    { [In]: Primitive[] } |
    { [NotIn]: Primitive[] } |
    { [Null]: true } |
    { [NotNull]: true }
)

export type CompatibleOperators<PropertyType extends any> = (
    PropertyType extends string
    ? StringOperators
    : PropertyType extends number
    ? NumberOperators
    : PropertyType extends boolean
    ? BooleanOperators
    : PropertyType extends Date
    ? DateOperators
    : never
)