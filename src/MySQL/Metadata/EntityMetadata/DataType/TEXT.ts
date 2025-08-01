import DataType from "./DataType"
import type { SQLColumnType } from "../ColumnMetadata"

export type TextLength = 'TINY' | 'MEDIUM' | 'LONG'

export default class TEXT extends DataType {
    constructor(length?: TextLength) {
        super(`${length?.toLocaleLowerCase()}text` as SQLColumnType)
    }
}