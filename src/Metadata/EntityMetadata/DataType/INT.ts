import DataType from "./DataType"
import type { SQLColumnType } from "../ColumnsMetadata"

export type IntegerLength = 'TINY' | 'SMALL' | 'MEDIUM' | 'BIG'

export default class INT extends DataType {
    constructor(public length?: IntegerLength) {
        super(`${length?.toLocaleLowerCase() ?? ''}int` as SQLColumnType)
    }
}