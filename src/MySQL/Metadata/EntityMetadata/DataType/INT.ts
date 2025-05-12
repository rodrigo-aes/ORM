import DataType from "./DataType"
import type { SQLColumnType } from "../ColumnMetadata"

export type IntegerLength = 'TINY' | 'SMALL' | 'MEDIUM' | 'BIG'

export default class INT extends DataType {
    constructor(length?: IntegerLength) {
        super(`${length?.toLocaleLowerCase()}int` as SQLColumnType)
    }
}