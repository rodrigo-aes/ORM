import DataType from "./DataType"
import type { SQLColumnType } from "../ColumnsMetadata"

export type TextLength = 'TINY' | 'MEDIUM' | 'LONG'

export default class TEXT extends DataType {
    constructor(public length?: TextLength) {
        super(`${length?.toLocaleLowerCase() ?? ''}text` as SQLColumnType)
    }
}