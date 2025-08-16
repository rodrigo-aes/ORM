import DataType from "./DataType"
import type { SQLColumnType } from "../ColumnsMetadata"

export type BlobLength = 'TINY' | 'MEDIUM' | 'LONG'

export default class BLOB extends DataType {
    constructor(length?: BlobLength) {
        super(`${length?.toLocaleLowerCase()}blob` as SQLColumnType)
    }
}