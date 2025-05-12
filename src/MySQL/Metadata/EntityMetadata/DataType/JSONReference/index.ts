import DataType from "../DataType"
import type { JSONColumnConfig } from "./types"

export default class JSONReference extends DataType {
    constructor(private dataType: DataType, public config: JSONColumnConfig) {
        super(dataType.type)
    }

    public override buildSQL(): string {
        const { type } = this.config
        return `${this.dataType.buildSQL()} GENERATED ALWAYS ${this.as()} ${type}`
    }

    private as() {
        const { json, path } = this.config
        return `AS (JSON_UNQUOTE(JSON_EXTRACT(${json}, '$.${path}')))`
    }
}

export type {
    JSONColumnConfig
}